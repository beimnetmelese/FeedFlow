export type FeedbackStats = {
    total_feedbacks: number;
    total_positive: number;
    total_negative: number;
    sector_breakdown: {
      [sector: string]: {
        total: number;
        positive: number;
        negative: number;
      };
    };
  };
  
  // Feedback.ts
  export type Feedback = {
    id: number;
    feedback_text: string;
    feedback_type: 'POSITIVE' | 'NEGATIVE';
    feedback_time: string;
    sector: string | null;
  };