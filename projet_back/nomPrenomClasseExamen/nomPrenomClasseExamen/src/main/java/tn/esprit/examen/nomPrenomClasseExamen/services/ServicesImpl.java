package tn.esprit.examen.nomPrenomClasseExamen.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tn.esprit.examen.nomPrenomClasseExamen.entities.*;
import tn.esprit.examen.nomPrenomClasseExamen.repositories.IClientRepository;
import tn.esprit.examen.nomPrenomClasseExamen.repositories.IInsuranceRepository;
import tn.esprit.examen.nomPrenomClasseExamen.repositories.ISinisterRepository;
import tn.esprit.examen.nomPrenomClasseExamen.repositories.IUserRepository;




import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class ServicesImpl implements IServices {

    private final IUserRepository usersRepository;
    private final IClientRepository clientRepository;
   private  final IInsuranceRepository insuranceRepository;
    private final ISinisterRepository sinisterRepository;

    @Override
    public Client add(Client client) {
        return clientRepository.save(client);
    }

    @Override
    public Insurance createInsurance(Insurance insurance) {
        return insuranceRepository.save(insurance);
    }

    @Override
    public Insurance updateInsurance(Long insuranceId, Insurance updatedInsurance) {
        Insurance existingInsurance = insuranceRepository.findById(insuranceId)
                .orElseThrow(() -> new IllegalArgumentException("Insurance not found with id: " + insuranceId));

        existingInsurance.setInsuranceType(updatedInsurance.getInsuranceType());
        existingInsurance.setStartDate(updatedInsurance.getStartDate());
        existingInsurance.setEndDate(updatedInsurance.getEndDate());
        existingInsurance.setDescription(updatedInsurance.getDescription());

        return insuranceRepository.save(existingInsurance);
    }

    @Override
    public void deleteInsurance(Long insuranceId) {
        insuranceRepository.deleteById(insuranceId);
    }

    @Override
    public List<Insurance> getAllInsurances() {
        return insuranceRepository.findAll();
    }

    @Override
    public Sinister addSinister(Sinister sinister) {
        return sinisterRepository.save(sinister);
    }

    @Override
    public Sinister updateSinister(Long sinisterId, Sinister updatedSinister) {
        Sinister existingSinister = sinisterRepository.findById(sinisterId)
                .orElseThrow(() -> new IllegalArgumentException("Sinister not found with id: " + sinisterId));

        existingSinister.setDateAccident(updatedSinister.getDateAccident());
        existingSinister.setDateDeclaration(updatedSinister.getDateDeclaration());
        existingSinister.setAccidentLocation(updatedSinister.getAccidentLocation());
        existingSinister.setTypeSinister(updatedSinister.getTypeSinister());
        existingSinister.setDescription(updatedSinister.getDescription());
        existingSinister.setStatus(updatedSinister.getStatus());
        existingSinister.setAttachmentPath(updatedSinister.getAttachmentPath());

        return sinisterRepository.save(existingSinister);
    }

    @Override
    public void deleteSinister(Long sinisterId) {
        if (!sinisterRepository.existsById(sinisterId)) {
            throw new IllegalArgumentException("Sinister not found with id: " + sinisterId);
        }
        sinisterRepository.deleteById(sinisterId);
    }

    @Override
    public List<Sinister> getAllSinisters() {
        return sinisterRepository.findAll();

    }

    @Override
    public Double simulateCompensation(Long sinisterId, int severity, boolean clientResponsible) {
        Sinister sinister = sinisterRepository.findById(sinisterId)
                .orElseThrow(() -> new RuntimeException("Sinistre non trouvé avec ID : " + sinisterId));

        double baseAmount = switch (sinister.getTypeSinister()) {
            case CAR -> 5000.0;
            case HOUSE -> 10000.0;
            case HEALTH -> 2000.0;
            case JOURNEY -> 1500.0;
        };

        // ✅ Ajustement en fonction de la gravité
        double severityMultiplier = switch (severity) {
            case 1 -> 0.5; // Dommages mineurs
            case 2 -> 0.75; // Dommages modérés
            case 3 -> 1.0; // Dommages majeurs
            default -> 0.0; // Non valable
        };

        // ✅ Si le client est responsable, réduction de l'indemnisation
        double responsibilityMultiplier = clientResponsible ? 0.5 : 1.0;

        // ✅ Calcul final
        double estimatedAmount = baseAmount * severityMultiplier * responsibilityMultiplier;

        // ✅ Enregistrement du montant estimé
        sinister.setEstimatedCompensation(estimatedAmount);
        sinisterRepository.save(sinister);

        return estimatedAmount;
    }

    @Override
    public Sinister updateSinisterLocation(Long sinisterId, String latitude, String longitude) {
        Sinister sinister = sinisterRepository.findById(sinisterId)
                .orElseThrow(() -> new RuntimeException("Sinistre non trouvé avec ID : " + sinisterId));

        sinister.setAccidentLocation(latitude + "," + longitude); // Stocke sous format "lat,lng"
        return sinisterRepository.save(sinister);
    }

    @Override
    public Sinister addSinisterToUser(Sinister sinister, Long userId) {
        Optional<Users> userOptional = usersRepository.findById(userId);

        if (userOptional.isPresent()) {
            Users user = userOptional.get();
            sinister.setUser(user); // Affectation du sinistre à l'utilisateur
            return sinisterRepository.save(sinister); // Sauvegarde en BD
        } else {
            throw new RuntimeException("User with ID " + userId + " not found");
        }
    }


    @Autowired
        private JavaMailSender javaMailSender;

        @Override
        public void sendEmail(String to, String subject, String body) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("Omayma.SELLAMI@esprit.tn");  // L'email de l'expéditeur (admin)

            javaMailSender.send(message);
        }




    @Scheduled(cron = "*/15 * * * * *")
    @Override
    public void test() {
        log.info("testing");
    }
}
