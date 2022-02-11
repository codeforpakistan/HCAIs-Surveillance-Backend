export interface HcaiDto {
   title: string;
   description: String,
   category: String,
   steps: [{
      stepTitle: String,
      stepDescription: String,
      fields: []
   }];
}