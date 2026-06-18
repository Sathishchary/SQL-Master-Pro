export interface InterviewStat {
  icon: string;
  val: string;
  label: string;
}

export interface InterviewQuestion {
  question: string;
  level: string;
  tags: string[];
  answer: string;
}

export interface InterviewSection {
  icon: string;
  title: string;
  category: string;
  desc: string;
  questions: InterviewQuestion[];
}
