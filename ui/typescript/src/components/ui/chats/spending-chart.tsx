import {useState} from "react";
import {format} from "date-fns";
import SqlModal from "@/components/modal-views/generated-sql-modal";
import {Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis} from "recharts";
import {SpendingData} from "@/data/static/spending";
import Button from "@/components/ui/button";
import CustomAxis from "@/components/transaction/custom-axis";

const RADIAN = Math.PI / 180;
const data = [
  
    { name: 'D', value: 25, color: '#0c834f' },
    { name: 'D', value: 25, color: '#7cf916' },
  { name: 'C', value: 25, color: '#e8c848' },

  
  { name: 'B', value: 25, color: '#ff8400' },
  { name: 'A', value: 25, color: '#ff0000' },
];
const cx = 225;
const cy = 150;
const iR = 70;
const oR = 120;
const value = 50;

const needle = (value: number, data: any[], cx: number, cy: number, iR: number, oR: number, color: string | undefined) => {
  let total = 0;
  data.forEach((v: { value: number; }) => {
    total += v.value;
  });
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
    <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="#none" fill={color} />,
  ];
};

export default function SpendingChart() {
    let [date, setDate] = useState(Date.now());
    let [spending, setSpending] = useState('4,500');
    let [isModalOpen, setIsModalOpen] = useState(false); // state variable for modal open status
    const formattedDate = format(new Date(date), 'MMMM d, yyyy');

    const closeModal = () => { // function to close the modal
        setIsModalOpen(false);
    };

    const openModal = () => { // function to open the modal
        setIsModalOpen(true);
    };

    return (
        <div className="rounded-lg bg-white p-6 shadow-card dark:bg-light-dark sm:p-8 bg-teal-50 shadow-lg">
                <h3 className="mb-2 text-base font-medium uppercase">
                    Utilization
                </h3>
                <div className="mb-1 text-base font-medium text-gray-900 dark:text-black sm:text-xl">
                    ${spending} / MTD
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                    {formattedDate}
                </div>
                <div className="relative flex  justify-center mt-5 h-64 sm:mt-8 2xl:h-72 3xl:h-[300px] 4xl:h-[300px]">
            <ResponsiveContainer width={450} height={300}>
                <PieChart width={450} height={300}>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={data}
          cx={cx}
          cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          paddingAngle={2}
          fill="#8884d8"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        {needle(value, data, cx, cy, iR, oR, '#3468D1')}
      </PieChart>
                    </ResponsiveContainer>

                    {/* <div className="text-center mt-2">
                        <h3 className="text-xl font-medium tracking-tighter text-black sm:text-blue-600">
                            Most expensive month
                        </h3>
                        <p className="mt-2 mb-2 text-xs font-medium text-gray-400 sm:text-sm">
                            September 2022 (SQL generated by GPT)
                        </p>
                        <Button
                            color="white"
                            variant="transparent"
                            size="mini"
                            shape="rounded"
                            onClick={openModal} // use openModal function here
                        >
                            <span className="text-xs tracking-tighter">View generated SQL</span>
                        </Button>
                    </div>

                    
                    <SqlModal isOpen={isModalOpen} closeModal={closeModal}/> */}
                </div>
        </div>
    );
}
