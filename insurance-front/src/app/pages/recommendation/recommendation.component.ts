import { Component, OnInit } from '@angular/core';
import { RecommendationService } from '../../services/recommendation.service';
import { Recommendation } from '../../models/recommendation.model';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent implements OnInit {
  recommendations: Recommendation[] = [];
  newRecommendation: Recommendation = { description: '', userPreferences: '', dateCreation: new Date(), status: '' };
  selectedRecommendation: Recommendation | null = null;
  filteredRecommendations: Recommendation[] = [];
  filterText: string = '';  
  currentPage: number = 1;  
  constructor(private recommendationService: RecommendationService) {}

  ngOnInit() {
    this.loadRecommendations();
  }

  loadRecommendations() {
    this.recommendationService.getAllRecommendations().subscribe(
      (data) => {
        this.recommendations = data;
        this.applyFilter(); 
      },
      (error) => console.error('❌ Error loading recommendations:', error)
    );
  }

  applyFilter() {
    this.filteredRecommendations = this.recommendations.filter((rec) =>
      rec.description.toLowerCase().includes(this.filterText.toLowerCase()) ||
      rec.userPreferences.toLowerCase().includes(this.filterText.toLowerCase()) ||
      rec.status.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  createRecommendation() {
    if (!this.newRecommendation.description || !this.newRecommendation.userPreferences) {
      console.error('❌ Please fill all required fields');
      return;
    }

    this.recommendationService.addRecommendation(this.newRecommendation).subscribe(
      () => {
        console.log('✅ Recommendation added successfully!');
        this.loadRecommendations();
        this.resetForm();
      },
      (error) => console.error('❌ Error adding recommendation:', error)
    );
  }

  editRecommendation(recommendation: Recommendation) {
    this.selectedRecommendation = { ...recommendation };
  }

  updateRecommendation() {
    if (this.selectedRecommendation && this.selectedRecommendation.idRec) {
      this.recommendationService.updateRecommendation(this.selectedRecommendation.idRec, this.selectedRecommendation)
        .subscribe(
          () => {
            console.log('✅ Recommendation updated successfully!');
            this.loadRecommendations();
            this.selectedRecommendation = null;
          },
          (error) => console.error('❌ Error updating recommendation:', error)
        );
    }
  }

  deleteRecommendation(id: number) {
    if (confirm('Are you sure you want to delete this recommendation?')) {
      this.recommendationService.deleteRecommendation(id).subscribe(
        () => {
          console.log('✅ Recommendation deleted successfully!');
          this.loadRecommendations();
        },
        (error) => console.error('❌ Error deleting recommendation:', error)
      );
    }
  }
  resetForm() {
    this.newRecommendation = { description: '', userPreferences: '', dateCreation: new Date(), status: 'Pending' };
  }
  cancelEdit() {
    this.selectedRecommendation = null;
  }
}
