package com.phegondev.usersmanagementsystem.service;

import com.phegondev.usersmanagementsystem.config.JWTAuthFilter;
import com.phegondev.usersmanagementsystem.dto.ReqRes;
import com.phegondev.usersmanagementsystem.email.EmailSender;
import com.phegondev.usersmanagementsystem.entity.Agency;
import com.phegondev.usersmanagementsystem.entity.Civility;
import com.phegondev.usersmanagementsystem.entity.ConfirmationToken;
import com.phegondev.usersmanagementsystem.entity.OurUsers;
import com.phegondev.usersmanagementsystem.repository.AgencyRepo;
import com.phegondev.usersmanagementsystem.repository.UsersRepo;
import io.jsonwebtoken.Jwts;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UsersManagementService {

    private final UsersRepo usersRepo;
    private final JWTUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final EmailValidator emailValidator;
    private final ConfirmationTokenService confirmationTokenService;
    private final EmailSender emailSender;
    private final AgencyRepo agencyRepo;
    private final String uploadDir;

    @Autowired
    public UsersManagementService(UsersRepo usersRepo,
                                 JWTUtils jwtUtils,
                                 AuthenticationManager authenticationManager,
                                 PasswordEncoder passwordEncoder,
                                 EmailValidator emailValidator,
                                 ConfirmationTokenService confirmationTokenService,
                                 EmailSender emailSender,
                                 AgencyRepo agencyRepo,
                                 @Value("${app.upload.dir}") String uploadDir) {
        this.usersRepo = usersRepo;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.emailValidator = emailValidator;
        this.confirmationTokenService = confirmationTokenService;
        this.emailSender = emailSender;
        this.agencyRepo = agencyRepo;
        this.uploadDir = uploadDir;
    }

    public ReqRes register(ReqRes registrationRequest, MultipartFile imageFile){
        ReqRes resp = new ReqRes();

        try {
            OurUsers ourUser = new OurUsers();
            ourUser.setEmail(registrationRequest.getEmail());
            ourUser.setCity(registrationRequest.getCity());
            ourUser.setRole(registrationRequest.getRole());
            ourUser.setName(registrationRequest.getName());
            ourUser.setLastname(registrationRequest.getLastname());
            ourUser.setDnaiss(registrationRequest.getDnaiss());
            ourUser.setCivility(registrationRequest.getCivility());
            ourUser.setCin(registrationRequest.getCin());

            ourUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            if (imageFile != null && !imageFile.isEmpty()) {
                File uploadFolder = new File(uploadDir);
                if (!uploadFolder.exists()) {
                    uploadFolder.mkdirs();
                }

                String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
                File file = new File(uploadDir + File.separator + fileName);

                imageFile.transferTo(file);
                ourUser.setImage(fileName);
            }
            OurUsers ourUsersResult = usersRepo.save(ourUser);
            if (ourUsersResult.getIduser() > 0) {
                resp.setOurUsers((ourUsersResult));
                resp.setMessage("Admin add User or Agent Successfully");
                resp.setStatusCode(200);
            }


        }catch (Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public ReqRes signup(ReqRes registrationRequest, MultipartFile imageFile){
        ReqRes resp = new ReqRes();
        boolean isValidEmail = emailValidator.test(registrationRequest.getEmail());
        if (!isValidEmail) {
            throw new IllegalStateException("email not valid");
        }
        boolean userExists = usersRepo.findByEmail(registrationRequest.getEmail()).isPresent();

        if (userExists) {
            throw new IllegalStateException("email already taken");
        }

        try {
            OurUsers ourUser = new OurUsers();
            ourUser.setEmail(registrationRequest.getEmail());
            ourUser.setCity(registrationRequest.getCity());
            ourUser.setName(registrationRequest.getName());
            ourUser.setRole(registrationRequest.getRole());
            ourUser.setLastname(registrationRequest.getLastname());
            ourUser.setDnaiss(registrationRequest.getDnaiss());
            ourUser.setCivility(registrationRequest.getCivility());
            ourUser.setCin(registrationRequest.getCin());
            ourUser.setImage(registrationRequest.getImage());
            ourUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            if (ourUser.getRole() == null || ourUser.getRole().isEmpty()) {
                ourUser.setRole("USER"); // Valeur par défaut
            }
            if (imageFile != null && !imageFile.isEmpty()) {
                File uploadFolder = new File(uploadDir);
                if (!uploadFolder.exists()) {
                    uploadFolder.mkdirs();
                }

                String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
                File file = new File(uploadDir + File.separator + fileName);

                imageFile.transferTo(file);
                ourUser.setImage(fileName);
            }
            OurUsers ourUsersResult = usersRepo.save(ourUser);

            String token = UUID.randomUUID().toString();
            ConfirmationToken confirmationToken = new ConfirmationToken(
                    token,
                    LocalDateTime.now(),
                    LocalDateTime.now().plusMinutes(15),
                    ourUsersResult
            );
            confirmationTokenService.saveConfirmationToken(confirmationToken);

            String link = "http://localhost:9090/auth/signup/confirm?token=" + token;
            emailSender.send(registrationRequest.getEmail(), buildEmail(registrationRequest.getName(), link));

            if (ourUsersResult.getIduser() > 0) {
                resp.setOurUsers((ourUsersResult));
                resp.setMessage("User added Successfully. Please check your email to confirm your account.");
                resp.setStatusCode(200);
            }

        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    @Transactional
    public String confirmToken(String token) {
        System.out.println("Token reçu : " + token); // Ajoute ce log

        ConfirmationToken confirmationToken = confirmationTokenService
                .getToken(token)
                .orElseThrow(() -> new IllegalStateException("token not found"));

        System.out.println("Token trouvé : " + confirmationToken.getToken()); // Log

        if (confirmationToken.getConfirmedAt() != null) {
            throw new IllegalStateException("email already confirmed");
        }

        LocalDateTime expiredAt = confirmationToken.getExpiresAt();

        if (expiredAt.isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("token expired");
        }

        confirmationTokenService.setConfirmedAt(token);
        enableOurUser(confirmationToken.getOurUser().getEmail());
        return "confirmed";
    }

    public int enableOurUser(String email) {
        return usersRepo.enableOurUser(email);
    }

    private String buildEmail(String name, String link) {
        return "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#333\">\n" +
                "\n" +
                "<span style=\"display:none;font-size:1px;color:#fff;max-height:0\"></span>\n" +
                "\n" +
                "  <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"100%\" height=\"53\" bgcolor=\"#FF8000\">\n" +
                "        \n" +
                "        <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;max-width:580px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n" +
                "          <tbody><tr>\n" +
                "            <td width=\"70\" bgcolor=\"#FF8000\" valign=\"middle\">\n" +
                "                <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td style=\"padding-left:10px\">\n" +
                "                  \n" +
                "                    </td>\n" +
                "                    <td style=\"font-size:28px;line-height:1.315789474;Margin-top:4px;padding-left:10px\">\n" +
                "                      <span style=\"font-family:Helvetica,Arial,sans-serif;font-weight:700;color:#ffffff;text-decoration:none;vertical-align:top;display:inline-block\">Confirmez votre e-mail</span>\n" +
                "                    </td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "              </a>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"10\" height=\"10\" valign=\"middle\"></td>\n" +
                "      <td>\n" +
                "        \n" +
                "                <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td bgcolor=\"#333\" width=\"100%\" height=\"10\"></td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\" height=\"10\"></td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "\n" +
                "\n" +
                "\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "      <td style=\"font-family:Helvetica,Arial,sans-serif;font-size:19px;line-height:1.315789474;max-width:560px\">\n" +
                "        \n" +
                "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#333\">Bonjour " + name + ",</p><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#333\"> Merci pour votre inscription. Veuillez cliquer sur le lien ci-dessous pour activer votre compte : </p><blockquote style=\"Margin:0 0 20px 0;border-left:10px solid #FF8000;padding:15px 0 0.1px 15px;font-size:19px;line-height:25px\"><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#333\"> <a href=\"" + link + "\">Activer maintenant</a> </p></blockquote>\n Le lien expirera dans 15 minutes. <p>À bientôt</p>" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "  </tbody></table><div class=\"yj6qo\"></div><div class=\"adL\">\n" +
                "\n" +
                "</div></div>";
    }

    public ReqRes login(ReqRes loginRequest){
        ReqRes response = new ReqRes();
        try {
            System.out.println("Tentative de connexion pour l'utilisateur : " + loginRequest.getEmail());
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            var user = usersRepo.findByEmail(loginRequest.getEmail()).orElseThrow();
            System.out.println("Valeur de enabled pour l'utilisateur : " + user.isEnabled());

            if (!user.isEnabled()) {
                System.out.println("Utilisateur non activé, activation en cours...");
                usersRepo.enableOurUser(user.getEmail());
                user = usersRepo.findByEmail(user.getEmail()).orElseThrow();
                System.out.println("Utilisateur activé ? " + user.isEnabled());
            }

            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);

            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRole(user.getRole());
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hrs");
            response.setMessage("Successfully Logged In");

        } catch (Exception e) {
            System.out.println("Erreur lors de la tentative de connexion : " + e.getMessage());
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }





    public ReqRes refreshToken(ReqRes refreshTokenReqiest){
        ReqRes response = new ReqRes();
        try{
            String ourEmail = jwtUtils.extractUsername(refreshTokenReqiest.getToken());
            OurUsers users = usersRepo.findByEmail(ourEmail).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenReqiest.getToken(), users)) {
                var jwt = jwtUtils.generateToken(users);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenReqiest.getToken());
                response.setExpirationTime("24Hr");
                response.setMessage("Successfully Refreshed Token");
            }
            response.setStatusCode(200);
            return response;

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
            return response;
        }
    }


    public ReqRes getAllUsers() {
        ReqRes reqRes = new ReqRes();

        try {
            List<OurUsers> result = usersRepo.findAll();
            if (!result.isEmpty()) {
                reqRes.setOurUsersList(result);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("No users found");
            }
            return reqRes;
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
            return reqRes;
        }
    }


    public ReqRes getUsersById(Long id) {
        ReqRes reqRes = new ReqRes();
        try {
            OurUsers usersById = usersRepo.findById(id).orElseThrow(() -> new RuntimeException("User Not found"));
            reqRes.setOurUsers(usersById);
            reqRes.setStatusCode(200);
            reqRes.setMessage("Users with id '" + id + "' found successfully");
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
        }
        return reqRes;
    }


    public ReqRes deleteUser(Long userId) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                usersRepo.deleteById(userId);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User deleted successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for deletion");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while deleting user: " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes updateUser(Long userId, OurUsers updatedUser, MultipartFile newImageFile) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                OurUsers existingUser = userOptional.get();

                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setCity(updatedUser.getCity());
                existingUser.setRole(updatedUser.getRole());
                existingUser.setName(updatedUser.getName());
                existingUser.setLastname(updatedUser.getLastname());
                existingUser.setDnaiss(updatedUser.getDnaiss());
                existingUser.setCivility(updatedUser.getCivility());
                existingUser.setCin(updatedUser.getCin());

                // Gestion de la nouvelle image
                if (newImageFile != null && !newImageFile.isEmpty()) {
                    // Check if the uploads directory exists
                    File uploadFolder = new File(uploadDir);
                    if (!uploadFolder.exists()) {
                        uploadFolder.mkdirs();
                    }

                    // Supprimer l'ancienne image si elle existe
                    if (existingUser.getImage() != null && !existingUser.getImage().isEmpty()) {
                        // Construire le chemin complet de l'ancienne image
                        File oldImageFile = new File(uploadDir + File.separator + existingUser.getImage());
                        if (oldImageFile.exists()) {
                            oldImageFile.delete(); // Supprimer l'ancienne image
                        }
                    }

                    // Sauvegarder la nouvelle image
                    String fileName = System.currentTimeMillis() + "_" + newImageFile.getOriginalFilename();
                    File newImage = new File(uploadDir + File.separator + fileName);
                    newImageFile.transferTo(newImage);

                    // Mettre à jour le chemin de l'image dans la base de données
                    existingUser.setImage(fileName);
                }

                // Mettre à jour le mot de passe si nécessaire
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }

                OurUsers savedUser = usersRepo.save(existingUser);
                reqRes.setOurUsers(savedUser);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User updated successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while updating user: " + e.getMessage());
        }
        return reqRes;
    }


    public ReqRes getMyInfo(String email) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findByEmail(email);
            if (userOptional.isPresent()) {
                OurUsers user = userOptional.get();

                // Vérifier si l'image existe et ajouter l'URL complète
                if (user.getImage() != null && !user.getImage().isEmpty()) {
                    String imageUrl = "http://localhost:9090/uploads/" + user.getImage();
                    user.setImage(imageUrl);
                }

                reqRes.setOurUsers(user);
                reqRes.setStatusCode(200);
                reqRes.setMessage("successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error: " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes assignAgencyToUser(Long userId, Long agencyId) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findById(userId);
            Optional<Agency> agencyOptional = agencyRepo.findById(agencyId);
            
            if (userOptional.isPresent() && agencyOptional.isPresent()) {
                OurUsers user = userOptional.get();
                Agency agency = agencyOptional.get();
                
                // Assign agency to user
                user.setAgency(agency);
                OurUsers updatedUser = usersRepo.save(user);
                
                reqRes.setOurUsers(updatedUser);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Agency assigned to user successfully");
            } else {
                if (!userOptional.isPresent()) {
                    reqRes.setStatusCode(404);
                    reqRes.setMessage("User not found");
                } else {
                    reqRes.setStatusCode(404);
                    reqRes.setMessage("Agency not found");
                }
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while assigning agency to user: " + e.getMessage());
        }
        return reqRes;
    }

}
