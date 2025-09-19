export interface BatteryTest {
  id: string;
  cellId: string;
  chemistry: 'NMC' | 'LFP' | 'LCO' | 'NCA';
  startDate: string;
  currentCycle: number;
  capacity: number;
  initialCapacity: number;
  temperature: number;
  cRate: number;
  status: 'active' | 'completed' | 'failed';
  testConditions: {
    chargeVoltage: number;
    dischargeVoltage: number;
    temperature: number;
    humidity: number;
  };
}

export interface CycleData {
  cycle: number;
  capacity: number;
  efficiency: number;
  impedance: number;
  temperature: number;
}

export interface TestData {
  test: BatteryTest;
  cycles: CycleData[];
}

export interface KPIData {
  totalCells: number;
  avgCyclesTo80: number;
  testsInProgress: number;
  completedTests: number;
}

export interface ChemistryStats {
  chemistry: string;
  avgCyclesToFailure: number;
  capacityRetention500: number;
  capacityRetention1000: number;
  capacityRetention2000: number;
  efficiency: number;
}