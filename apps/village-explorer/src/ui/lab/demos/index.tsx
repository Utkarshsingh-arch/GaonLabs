import React from 'react';
import { ZoneId, Lang } from '../../../learning/types';
import { HouseDemo } from './HouseDemo';
import { WellDemo } from './WellDemo';
import { TankDemo } from './TankDemo';
import { SolarDemo } from './SolarDemo';
import { SoilDemo } from './SoilDemo';
import { FarmDemo } from './FarmDemo';

interface DemoRendererProps {
  zoneId: ZoneId;
  lang: Lang;
}

export const LabDemoRenderer: React.FC<DemoRendererProps> = ({ zoneId, lang }) => {
  switch (zoneId) {
    case 'house':
      return <HouseDemo lang={lang} />;
    case 'well':
      return <WellDemo lang={lang} />;
    case 'tank':
      return <TankDemo lang={lang} />;
    case 'solar':
      return <SolarDemo lang={lang} />;
    case 'soil':
      return <SoilDemo lang={lang} />;
    case 'farm':
      return <FarmDemo lang={lang} />;
    default:
      return null;
  }
};
