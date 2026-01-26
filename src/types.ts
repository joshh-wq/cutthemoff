export interface Service {
  id: string;
  name: string;
  category: string;
  monthlyPrice: number;
  reason: string;
  cancelUrl: string;
  cancelSteps: string[];
}
