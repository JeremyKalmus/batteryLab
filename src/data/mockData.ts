import { BatteryTest, TestData, KPIData, ChemistryStats } from '../types/battery';

export const mockTests: BatteryTest[] = [
  {
    id: 'BT-001',
    cellId: 'NMC-18650-001',
    chemistry: 'NMC',
    startDate: '2024-01-15',
    currentCycle: 1250,
    capacity: 2.8,
    initialCapacity: 3.5,
    temperature: 25,
    cRate: 1.0,
    status: 'active',
    testConditions: {
      chargeVoltage: 4.2,
      dischargeVoltage: 2.5,
      temperature: 25,
      humidity: 45
    }
  },
  {
    id: 'BT-002',
    cellId: 'LFP-26650-002',
    chemistry: 'LFP',
    startDate: '2024-01-20',
    currentCycle: 2100,
    capacity: 2.9,
    initialCapacity: 3.2,
    temperature: 40,
    cRate: 0.5,
    status: 'active',
    testConditions: {
      chargeVoltage: 3.6,
      dischargeVoltage: 2.0,
      temperature: 40,
      humidity: 50
    }
  },
  {
    id: 'BT-003',
    cellId: 'LCO-18650-003',
    chemistry: 'LCO',
    startDate: '2024-02-01',
    currentCycle: 850,
    capacity: 2.1,
    initialCapacity: 2.6,
    temperature: 25,
    cRate: 1.0,
    status: 'completed',
    testConditions: {
      chargeVoltage: 4.2,
      dischargeVoltage: 2.75,
      temperature: 25,
      humidity: 45
    }
  },
  {
    id: 'BT-004',
    cellId: 'NCA-21700-004',
    chemistry: 'NCA',
    startDate: '2024-02-10',
    currentCycle: 1680,
    capacity: 3.8,
    initialCapacity: 4.8,
    temperature: 25,
    cRate: 0.5,
    status: 'active',
    testConditions: {
      chargeVoltage: 4.2,
      dischargeVoltage: 2.5,
      temperature: 25,
      humidity: 40
    }
  }
];

export const generateCycleData = (test: BatteryTest): TestData => {
  const cycles = [];
  const degradationRate = test.chemistry === 'LFP' ? 0.08 : test.chemistry === 'NMC' ? 0.15 : 0.25;
  
  for (let i = 0; i <= test.currentCycle; i += 50) {
    const capacityFade = 1 - (degradationRate * i / 1000);
    cycles.push({
      cycle: i,
      capacity: test.initialCapacity * Math.max(0.6, capacityFade + (Math.random() - 0.5) * 0.05),
      efficiency: 95 + (Math.random() - 0.5) * 10,
      impedance: 50 + (i / 100) + (Math.random() - 0.5) * 10,
      temperature: test.temperature + (Math.random() - 0.5) * 5
    });
  }
  
  return { test, cycles };
};

export const mockKPIData: KPIData = {
  totalCells: 24,
  avgCyclesTo80: 1850,
  testsInProgress: 18,
  completedTests: 6
};

export const mockChemistryStats: ChemistryStats[] = [
  {
    chemistry: 'NMC',
    avgCyclesToFailure: 2200,
    capacityRetention500: 92,
    capacityRetention1000: 85,
    capacityRetention2000: 72,
    efficiency: 94.5
  },
  {
    chemistry: 'LFP',
    avgCyclesToFailure: 3800,
    capacityRetention500: 96,
    capacityRetention1000: 92,
    capacityRetention2000: 85,
    efficiency: 96.2
  },
  {
    chemistry: 'LCO',
    avgCyclesToFailure: 1200,
    capacityRetention500: 88,
    capacityRetention1000: 78,
    capacityRetention2000: 65,
    efficiency: 92.1
  },
  {
    chemistry: 'NCA',
    avgCyclesToFailure: 2800,
    capacityRetention500: 94,
    capacityRetention1000: 87,
    capacityRetention2000: 75,
    efficiency: 93.8
  }
];

export const chemistryColors: { [key: string]: string } = {
  NMC: '#2563eb',
  LFP: '#059669',
  LCO: '#dc2626',
  NCA: '#7c3aed'
};