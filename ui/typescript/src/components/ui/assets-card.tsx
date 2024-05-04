import cn from 'classnames';
import {useState} from 'react';
import {Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip} from 'recharts';
import {ArrowLongUpIcon, ArrowUpIcon} from "@heroicons/react/24/outline";
import {assetsDataAtom, loadingPersonalizeAtom} from "@/data/personalize/store";
import {useAtom} from "jotai";
import Skeleton from "@/components/ui/skeleton";
import React, { PureComponent } from 'react';



const renderActiveShape = (props: { cx: any; cy: any; midAngle: any; innerRadius: any; outerRadius: any; startAngle: any; endAngle: any; fill: any; payload: any; percent: any; value: any; volume: any}) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value, volume } = props;
  console.log('props are', props);
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 12;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${volume}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`Rate ${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};


const data = [
    {
        name: 'Travel',
        value: 400,
        volume: '+12.5%',
        isChangePositive: true,
    },
    {
        name: 'Dining',
        value: 300,
        volume: '-8.47%',
        isChangePositive: true,
    },
    {
        name: 'Grocery',
        value: 300,
        volume: '+5.63%',
        isChangePositive: true,
    },
    {
        name: 'Gas',
        value: 300,
        volume: '10.02%',
        isChangePositive: true,
    },
    {
        name: 'Other',
        value: 100,
        volume: '10.02%',
        isChangePositive: true,
    },
];

export default function AssetsCard() {
    
    const [isChangePositive, setChangeStatus] = useState(true);
    const [percentage, setPercentage] = useState(data[0].volume);
    const [assetsData] = useAtom(assetsDataAtom);
    const [loadingPersonalize] = useAtom(loadingPersonalizeAtom);
    const [activeIndex, setActiveIndex] = useState(0);
    
    const onPieEnter = (_: any, index: React.SetStateAction<number>) => {
        setActiveIndex(index);
      };
    return (
        <div className="rounded-lg bg-blue-50 p-6 shadow-card shadow-lg dark:bg-light-dark sm:p-8">
            <h3 className="mb-2 text-base font-medium uppercase">Spending</h3>

            <div className="relative flex h-[300px] justify-center">
            <ResponsiveContainer width={450} height={300}>
                <PieChart width={450} height={300}>
                    <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={data}
                        cx={225}
                        cy={150}
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                    >
                            {assetsData.map((currency) => (
                                <Cell
                                    key={`cell-${currency.code}`}
                                    fill={currency.color}
                                    stroke="transparent"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<></>}/>
                    </PieChart>
                </ResponsiveContainer>
                {/* <div
                    className="absolute left-2/4 top-2/4 flex h-[156px] w-[156px] -translate-x-2/4 -translate-y-2/4 transform items-center justify-center rounded-full border border-dashed border-gray-400 bg-gray-50 dark:border-gray-600 dark:bg-gray-900">
          <span
              className={cn(
                  'flex items-center text-base font-medium',
                  isChangePositive ? 'text-green-500' : 'text-red-500'
              )}
          >
            <ArrowLongUpIcon
                className={cn('w-4', {
                    'rotate-180': !isChangePositive,
                })}
            />
              {percentage}
          </span>
                </div> */}
            </div>

            {/* <div className="mt-2">
                <div className="mb-5 flex items-center justify-between text-sm font-medium text-gray-400">
                    <span>Asset</span>
                    <span>GPT recommendation</span>
                    <span>YTD performance</span>
                </div>
                <ul className="grid gap-5">
                    {assetsData.map((asset) => (
                        <li
                            key={asset.volume}
                            className="grid grid-cols-[150px_repeat(2,1fr)] items-center justify-between text-sm font-medium text-gray-900 dark:text-black 2xl:grid-cols-[140px_repeat(2,1fr)] 3xl:grid-cols-[150px_repeat(2,1fr)]"
                        >
              <span className="flex items-center gap-2.5 whitespace-nowrap">
                {asset.icon}
                  {asset.name}
              </span>
                            <span className="text-center">
                              {loadingPersonalize ? (
                                  <Skeleton className="!h-4 !w-full" animation/>
                              ) : (
                                  asset.gptRecommendation
                              )}
                            </span>

                            <span
                                className={cn(
                                    'flex items-center justify-end',
                                    asset.isChangePositive ? 'text-green-500' : 'text-red-500'
                                )}
                            >
                <span
                    className={cn('ltr:mr-2 rtl:ml-2', {
                        'rotate-180': !asset.isChangePositive,
                    })}
                >
                  <ArrowUpIcon/>
                </span>
                                {asset.volume}
              </span>
                        </li>
                    ))}
                </ul>
            </div> */}
        </div>
    );
}
