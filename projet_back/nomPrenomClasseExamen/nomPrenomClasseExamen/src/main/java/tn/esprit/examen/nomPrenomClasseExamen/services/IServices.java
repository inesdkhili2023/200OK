package tn.esprit.examen.nomPrenomClasseExamen.services;


import tn.esprit.examen.nomPrenomClasseExamen.entities.Client;
import tn.esprit.examen.nomPrenomClasseExamen.entities.Insurance;
import tn.esprit.examen.nomPrenomClasseExamen.entities.Sinister;

import java.util.List;

public interface IServices {
    Client add(Client client);
    Insurance createInsurance(Insurance insurance);
    Insurance updateInsurance(Long insuranceId, Insurance updatedInsurance);
    void deleteInsurance(Long insuranceId);
    List<Insurance> getAllInsurances();
    Sinister addSinister(Sinister sinister);
    Sinister updateSinister(Long sinisterId, Sinister updatedSinister);
    void deleteSinister(Long sinisterId);
    List<Sinister> getAllSinisters();
    Double simulateCompensation(Long sinisterId, int severity, boolean clientResponsible);
    public Sinister updateSinisterLocation(Long sinisterId, String latitude, String longitude);

    Sinister addSinisterToUser(Sinister sinister, Long userId);
    void sendEmail(String to, String subject, String body);










    void test();
}
