import {BanknotesIcon, ChartBarSquareIcon, CurrencyDollarIcon, HomeModernIcon} from "@heroicons/react/24/outline";

import travel from '@/assets/images/assets/travel.png';
import dining from '@/assets/images/assets/dinner-table.png';
import gas from '@/assets/images/assets/fuel.png';
import grocery from '@/assets/images/assets/vegetable.png';
export const AssetsData = [
  {
    icon: <ChartBarSquareIcon className="h-6 w-6 text-gray-500" />,
    name: 'Travel',
    gptRecommendation: 'Buy',
    code: 'travel',
    volume: '+12.5%',
    color: '#F79517',
    isChangePositive: true,
    src: travel,
  },
  {
    icon: <BanknotesIcon className="h-6 w-6 text-gray-500" />,
    name: 'Dining',
    gptRecommendation: 'Sell',
    code: 'dining',
    volume: '+8.47%',
    color: '#259C77',
    isChangePositive: true,
    src: dining,
  },
  {
    icon: <CurrencyDollarIcon className="h-6 w-6 text-gray-500" />,
    name: 'Grocery',
    gptRecommendation: 'Hold',
    code: 'grocery',
    volume: '+5.63%',
    color: '#3468D1',
    isChangePositive: true,
    src: grocery,
  },
  {
    icon: <HomeModernIcon className="h-6 w-6 text-gray-500" />,
    name: 'Gas',
    gptRecommendation: 'Buy',
    code: 'gas',
    volume: '+30.02%',
    color: '#ff0000',
    isChangePositive: true,
    src: gas,
  },
  {
    icon: <HomeModernIcon className="h-6 w-6 text-gray-500" />,
    name: 'Other',
    gptRecommendation: 'Buy',
    code: 'real-estate',
    volume: '+10.02%',
    color: '#F3BA2F',
    isChangePositive: true,
  },
];
