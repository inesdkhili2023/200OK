package tn.esprit.examen.nomPrenomClasseExamen.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.examen.nomPrenomClasseExamen.entities.Sinister;
import tn.esprit.examen.nomPrenomClasseExamen.entities.SinisterType;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
public interface ISinisterRepository extends JpaRepository<Sinister,Long> {

    @Query("SELECT s.typeSinister, COUNT(s) FROM Sinister s GROUP BY s.typeSinister")
    List<Object[]> countSinisterByType();
}

