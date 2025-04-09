package tn.esprit.examen.nomPrenomClasseExamen.entities;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum SinisterType {
    CAR,
    HEALTH,
    HOUSE,
    JOURNEY
}
