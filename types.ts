
export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
}

export interface SDR {
    id: string;
    name: string;
}

export interface Salesperson {
    id: string;
    name: string;
    gender: Gender;
    avatar: string;
}

export interface ConsultantData {
    salespersonId: string;
    sdrGoal: number;
    leadGoal: number;
    inboundLeads: number;
    outboundLeads: number;
    partnerLeads: number;
    iaLeads: number;
    magoGoal: number;
    magoAchieved: number;
    financialGoalNR: number;
    nrSales: number;
    financialGoalMRR: number;
    mrrSales: number;
    contractsSigned: number;
}

export interface MonthlyData {
    year: number;
    month: number;
    workingDays: number;
    sdrInProduction: number;
    sdrInPreparation: number;
    nrGoal: number;
    mrrGoal: number;
    managerialGoal: number;
    consultants: ConsultantData[];
    isClosed: boolean;
}

export type AllData = Record<string, MonthlyData>;