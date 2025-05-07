import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common'; 
import { JobApplicationService } from '../services/job-application.service';
import { JobOfferService } from '../services/job-offer.service';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { VoiceRecognitionService } from '../services/voice-recognition.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
@Component({
  selector: 'app-job-application-form',
  templateUrl: './job-application-form.component.html',
  styleUrls: ['./job-application-form.component.css']
})
export class JobApplicationFormComponent  implements OnInit  {
  @Input() selectedJob: any;
  @Output() closeFormEvent = new EventEmitter<void>(); 
  message: string = '';
  jobApplicationForm!: FormGroup;
  jobReference: string | null = null;
  selectedJobId: number | null = null;
  jobOfferId!: number;
  siteKey: string = '6Le5S-MqAAAAALSbrYTUmV1IgrBQPBExN4zJpBVq';
  submitted = false; // Variable pour suivre l'état de soumission

  isListening = false;
  recognition: any;
  transcript: string = '';
  buttonText!: Observable<string>;

    constructor(private fb: FormBuilder,
      private jobApplicationService: JobApplicationService, private jobOfferService:JobOfferService,private voiceRecognitionService: VoiceRecognitionService,
      private route: ActivatedRoute, private location: Location,private router: Router,private http:HttpClient,private snackBar: MatSnackBar) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          window.scrollTo(0, 0); // Remonte en haut de la page
        }
      });
      
    }
    ngOnInit(): void {
      this.voiceRecognitionService.init();
      this.voiceRecognitionService.transcript$.subscribe(transcript => {
        if (transcript) {
          const current = this.jobApplicationForm.get('commentaire')?.value || '';
          this.jobApplicationForm.get('commentaire')?.setValue(current + ' ' + transcript);
        }
      });
      const storedJob = localStorage.getItem('selectedJob');
  if (storedJob) {
    this.selectedJob = JSON.parse(storedJob);
  }
      const jobOfferId = this.route.snapshot.paramMap.get('id'); // Récupérer l'ID depuis l'URL
      // Vérifier l'ID du job dans l'URL
    console.log('ID du job dans l\'URL:', jobOfferId);

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.jobOfferId = +id; // Convert string to number
        
      }
    });

    this.jobApplicationForm = this.fb.group({
      civilite: ['', Validators.required],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      dateNaissance: ['', [Validators.required, this.dateNaissanceValidator]],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      codePostal: ['', [Validators.required, Validators.pattern('^[0-9]{4,5}$')]],
      niveauEtudes: ['', Validators.required],
      typePoste: ['', Validators.required],
      niveauExperience: ['', Validators.required],
      disponibilite: ['', Validators.required],
      specialiteEtude: ['', Validators.required],
      languages: [[], Validators.required], 
      commentaire: [''],
      lettreMotivation: [null],
      resume: [null, Validators.required],
      recaptcha: ['', Validators.required], // Date d'application automatique
      jobOffer: { jobOfferId: this.jobOfferId||'' },
      consent: [false, Validators.requiredTrue]},
      {
        validators: this.emailMatchValidator
    });

    // Mise à jour du champ commentaire en live
    this.voiceRecognitionService.recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');

      const current = this.jobApplicationForm.get('commentaire')?.value || '';
      this.jobApplicationForm.get('commentaire')?.setValue(current + ' ' + transcript);
    };

     // Mise à jour du formulaire après récupération de l’offre
  if (this.jobOfferId) {
    this.jobApplicationForm.patchValue({ jobOfferId: this.jobOfferId });
  }
    if (jobOfferId) {
      this.jobOfferService.getJobById(jobOfferId).subscribe(
        (job) => {
          this.selectedJob = job;
          this.selectedJobId = job.jobOfferId; // Récupère l'ID de l'offre
          console.log('Détails du job récupérés:', this.selectedJob);
       // Mise à jour du formulaire une fois les données récupérées
       this.jobApplicationForm.patchValue({ jobOfferId: this.selectedJobId });
      },
      (error) => {
        console.error('Erreur lors de la récupération du job:', error);
      }
    );
    
  }
    this.jobReference = jobOfferId;
    console.log('Postuler pour l’offre :', this.jobReference);
    // Vérifier si selectedJob existe et initialiser les données si nécessaire
    if (this.selectedJob) {
      console.log('Job sélectionné:', this.selectedJob);
    }
    this.jobReference = this.route.snapshot.paramMap.get('id');
    console.log('Postuler pour l’offre :', this.jobReference);
    }
     id = this.route.snapshot.paramMap.get('id'); // Récupérer l'ID depuis l'URL

    private mapFormToBackend(): any {
      return {
        firstName: this.jobApplicationForm.value.prenom,
        lastName: this.jobApplicationForm.value.nom,
        email: this.jobApplicationForm.value.email,
        phone: this.jobApplicationForm.value.telephone,
        address: this.jobApplicationForm.value.adresse,
        city: this.jobApplicationForm.value.ville,
        zipCode: this.jobApplicationForm.value.codePostal,
        educationLevel: this.jobApplicationForm.value.niveauEtudes,
        experienceLevel: this.jobApplicationForm.value.niveauExperience,
        fieldOfStudy: this.jobApplicationForm.value.specialiteEtude,
        jobType: this.jobApplicationForm.value.typePoste ? String(this.jobApplicationForm.value.typePoste) : null,
        immediateAvailability: this.jobApplicationForm.value.disponibilite,
        languages: this.jobApplicationForm.value.languages ? this.jobApplicationForm.value.languages.join(', ') : null,
        commentaire: this.jobApplicationForm.value.commentaire || '', // Ajout du commentaire
        resume: this.jobApplicationForm.value.resume,
        lettreMotivation: this.jobApplicationForm.value.lettreMotivation , // Ajout de la lettre de motivation
       // jobOfferId: this.jobApplicationForm.value.jobOfferId||'', // Utiliser la valeur du formulaire
        appliedAt: new Date().toISOString(), // Date d'application automatique
        jobOffer: { jobOfferId: this.jobOfferId||'' },


      };
   

      
    }

    
   

    handleCaptcha(token: string | null) {
      console.log("reCAPTCHA Token reçu :", token);
      if (token) {
        this.jobApplicationForm.controls['recaptcha'].setValue(token);
        console.log("Valeur du recaptcha mise à jour :", this.jobApplicationForm.controls['recaptcha'].value);
      } else {
        this.jobApplicationForm.controls['recaptcha'].setErrors({ required: true });
        console.warn("reCAPTCHA non résolu ou expiré.");
      }
    }
    
    validateFile(file: File | null, allowedTypes: string[], maxSizeMB: number): boolean {
      if (!file) return false;
    
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (!allowedTypes.includes(file.type)) {
        alert(`Seuls les fichiers ${allowedTypes.join(', ')} sont autorisés.`);
        return false;
      }
      if (file.size > maxSizeBytes) {
        alert(`La taille du fichier ne doit pas dépasser ${maxSizeMB} Mo.`);
        return false;
      }
      return true;
    }
    cvFile: File | null = null;
    lettreMotivationFile: File | null = null;
    
 
    
    
     
    
    dateNaissanceValidator(control: AbstractControl): { [key: string]: boolean } | null {
      if (!control.value) {
        return null; // Ne pas valider si le champ est vide (handled par Validators.required)
      }
      const today = new Date();
      const birthDate = new Date(control.value);
      
      if (birthDate >= today) {
        return { 'invalidDate': true };
      }
      return null;
    }
    emailMatchValidator(form: FormGroup) {
      const email = form.get('email')?.value;
      const confirmEmail = form.get('confirmEmail')?.value;
      return email === confirmEmail ? null : { emailMismatch: true };
    }
// Méthode pour envoyer la candidature au backend
submitApplication(): void {
  this.submitted = true; // Activer l'affichage des erreurs

  const formData = {
    ...this.jobApplicationForm.value,
    jobOfferId: this.jobOfferId
  };
  formData.disponibilite = formData.disponibilite === 'True' ? 1 : 0;
  formData.resume = this.jobApplicationForm.value.resume;
  formData.lettreMotivation = this.jobApplicationForm.value.lettreMotivation;


  const mappedData = this.mapFormToBackend();
 
  console.log("Données envoyées au backend :", mappedData);
  if (this.jobApplicationForm.invalid) {
    this.snackBar.open('Le formulaire est invalide. Veuillez corriger les erreurs.', 'Fermer', {
      duration: 4000,

      panelClass: ['snackbar-error']
    });
    console.log('Le formulaire est invalide', this.jobApplicationForm.errors);
    return;
  }
  



 // mappedData.jobOfferId = this.selectedJob ? this.selectedJob.jobOfferId : null;
  this.jobApplicationService.submitJobApplication(mappedData).subscribe(
    response => {
      console.log('Candidature envoyée avec succès', response);
      this.snackBar.open('Votre candidature a bien été envoyée !', 'Fermer', {
        duration: 4000,
        panelClass: ['snackbar-success']
      });      this.location.back();
      // Récupérer l'email du candidat et appeler le backend pour envoyer l'email
      const candidatEmail = this.jobApplicationForm.value.email;
    },
    error => {
      console.error('Erreur lors de l’envoi de la candidature', error);
    }
  );
}
submitApplication2() {
  const formData = new FormData();

  // Convertir l'objet formulaire en JSON et l'ajouter sous forme de chaîne
  const jobApplicationData = JSON.stringify(this.jobApplicationForm.value);
  const jobApplicationBlob = new Blob([jobApplicationData], { type: 'application/json' });
  formData.append("jobApplication", jobApplicationBlob);

  // Ajouter les fichiers (Assurez-vous que `resumeFile` et `lettreMotivationFile` sont définis)
  if (this.cvFile) {
    formData.append("resume", this.cvFile, this.cvFile.name);
  }
  if (this.lettreMotivationFile) {
    formData.append("lettreMotivation", this.lettreMotivationFile, this.lettreMotivationFile.name);
  }


  this.http.post('http://localhost:8081/jobapplications/apply', formData, { responseType: 'text' as 'json' })
  .subscribe(
    response => {
      console.log("Réponse du backend :", response);
    },
    error => {
      console.error("Erreur lors de l'envoi de la candidature", error);
    }
  );

}

// Fonction pour récupérer les fichiers du formulaire
onFileSelected(event: any, type: string) {
  if (event.target.files.length > 0) {
    if (type === "resume") {
      this.cvFile = event.target.files[0];
    } else if (type === "lettreMotivation") {
      this.lettreMotivationFile = event.target.files[0];
    }
  }
}

uploadFiles(cvFile: File, lettreMotivationFile: File) {
  const formData = new FormData();

  formData.append('cv', cvFile);
  formData.append('lettreMotivation', lettreMotivationFile);

  return this.http.post('http://localhost:8081/jobapplications/fileUpload', formData).pipe(
    map((response: any) => {
      return {
        resumePath: `/uploads/${cvFile.name}`,
        lettreMotivationPath: `/uploads/${lettreMotivationFile.name}`
      };
    })
  );
}



  closeForm(): void {
    this.location.back(); 
  }

 

  stopRecording() {
    this.voiceRecognitionService.stop();
    this.message += this.voiceRecognitionService.text;
    this.voiceRecognitionService.text = ''; // Clear the recognized text after appending to message
  }



  startListening(): void {
    this.isListening = true;
    this.voiceRecognitionService.start();
  
  }
  

  stopListening() {
    this.isListening = false;
    this.voiceRecognitionService.stop();
  }

  get transcribedText(): string {
    return this.voiceRecognitionService.text;
  }
  submitMessage(event: KeyboardEvent) {
    event.preventDefault();
    this.stopListening();
}
}
  


