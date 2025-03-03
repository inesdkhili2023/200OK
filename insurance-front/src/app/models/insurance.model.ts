export interface Insurance {
  insuranceId?: number; // optional field for new records
  insuranceType: string;
  startDate: Date;
  endDate: Date;
  description: string;
}
