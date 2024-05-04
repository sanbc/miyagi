import React, { useState } from 'react';
import {useFlexLayout, usePagination, useResizeColumns, useSortBy, useTable,} from 'react-table';
import {Area, AreaChart, ResponsiveContainer} from 'recharts';
import Scrollbar from '@/components/ui/scrollbar';
import {ChevronDownIcon} from "@heroicons/react/24/outline";
import {useBreakpoint} from '@/lib/hooks/use-breakpoint';
import {useIsMounted} from '@/lib/hooks/use-is-mounted';
import {cardRecommendationsDataAtom, loadingPersonalizeAtom} from "@/data/personalize/store";
import Skeleton from '@/components/ui/skeleton';
import {useAtom} from "jotai";
import Image from '@/components/ui/image';
import Button from '../ui/button';
import { AssetsData } from '@/data/static/assetsData';
import toast from 'react-hot-toast';
const COLUMNS = [
  {
    Header: '#',
    accessor: 'id',
    minWidth: 20,
    maxWidth: 40,
  },
  {
    Header: 'Card Name',
    accessor: 'name',
    // @ts-ignore
    // Cell: ({ cell: { value } }) => (
    //   // <div className="ltr:text-right rtl:text-left">{value}</div>
    //   <div className="mb-5 grid grid-cols-3 gap-4 text-sm text-gray-900 last:mb-0 dark:text-black">
    //     <div className="col-span-2 flex items-center gap-2">
    //       <span className="flex flex-col gap-0.5">
    //         <span className="whitespace-nowrap text-xs font-medium capitalize">
    //           {value.name}
    //         </span>
    //         <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
    //           {/* {value.symbol} */}
    //         </span>
    //       </span>
    //     </div>
    //   </div>
    // ),
    minWidth: 30,
    maxWidth: 50,
  },
  {
    Header: () => (
      <div className="ltr:ml-auto ltr:text-right rtl:mr-auto rtl:text-left">
        Points Earned
      </div>
    ),
    accessor: 'Points',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div className="ltr:text-right rtl:text-left">${value}</div>
    ),
    minWidth: 40,
    maxWidth: 60,
  },
  {
    Header: () => (
      <div className="ltr:ml-auto ltr:text-right rtl:mr-auto rtl:text-left">
        CashBack rate 
      </div>
    ),
    accessor: 'Rewardrate',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div
        className={`ltr:text-right rtl:text-left ${
          value > 0 ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {value}%
      </div>
    ),
    minWidth: 40,
    maxWidth: 60,
  },
  {
    Header: () => (
        <div className="ltr:ml-auto ltr:text-right rtl:mr-auto rtl:text-left">
          GPT Recommendation
        </div>
    ),
    accessor: 'CardRecommendation',
    // @ts-ignore
    Cell: ({ cell: { value } }) => {
      return (
        <div className="ltr:text-right rtl:text-left"> {value}</div>
    );
      // const [loadingPersonalize] = useAtom(loadingPersonalizeAtom);

      // return loadingPersonalize ? (
      //     <Skeleton className="!h-4 !w-full" animation />
      // ) : (
      //     <div className="ltr:text-right rtl:text-left">{value}</div>
      // );
    },
    minWidth: 150,
    maxWidth: 200,
  },
  {
    Header: () => (
      <div className="ltr:ml-auto ltr:text-right rtl:mr-auto rtl:text-left">
        Card Activity
      </div>
    ),
    accessor: 'CardActivity',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div className="h-10 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={value}>
            <defs>
              <linearGradient
                id="spending-gradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="natural"
              dataKey="value"
              stroke="#60a5fa"
              strokeWidth={1.5}
              fill="url(#spending-gradient)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    ),
    minWidth: 100,
    maxWidth: 120,
  },
];

export default function TopInvestmentsTable() {
  useIsMounted();
  useBreakpoint();
  const [data, setCardRecommendationsData] = useAtom(cardRecommendationsDataAtom);
  const columns = React.useMemo(() => COLUMNS, []);
  const [loadingPersonalize, setLoadingPersonalizeAtom] = useAtom(loadingPersonalizeAtom);
  const [selectedCategory, setSelectedCategory] = useState('travel');
  const {
    getTableProps,
    getTableBodyProps,
    state,
    headerGroups,
    page,
    prepareRow,
  } = useTable(
    {
      // @ts-ignore
      columns,
      data,
    },
    useSortBy,
    useResizeColumns,
    useFlexLayout,
    usePagination
  );

  const { pageIndex } = state;

  const fetchRecommendations = async (category: string) => {
    
    setSelectedCategory(category);
    console.log('category', category, selectedCategory)
    setLoadingPersonalizeAtom(true);
    try{ 
      const topCardRecommendations = `which credit card to use for ${category}?`;
      const response = await fetch(`${process.env.NEXT_PUBLIC_RECCOMMENDATION_SERVICE_URL?.replace(/\/+$/, '')}/fetch_recommendations?category=${category}` , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(topCardRecommendations),
        
      });
      // const response = { ok: {}};
      console.dir(response);

      if (!response.ok) {
          console.error('HTTP error: ', response);
          toast.error('Failed to fetch personalization. Try again later.');
      }

      const responseData = await response.json();
      console.log('Successfully got personalization');
      console.dir(responseData);
      toast.success('Personalization successful');

      // Extract the relevant data from the response
      const updatedAssetData = {...responseData}

    // Update the fetched data atoms
    setCardRecommendationsData(updatedAssetData);

    } catch (error) {
        console.error('Failed to fetch personalizations');
        console.dir(error);
        toast.error('Failed to fetch personalization');
    } finally {
        setLoadingPersonalizeAtom(false);
    }
  } 

  // @ts-ignore
  return (
    <div className="">
       <div className="flex flex-col items-center justify-between pb-5  md:flex-row">
      <h3 className="mb-3 shrink-0 text-lg font-medium font-bold  text-blue-400 dark:text-black sm:text-xl md:mb-0 md:text-2xl">
        Click on the purchase category to change top card recommendations 
      </h3>
      </div>
      
      <div className='space-x-3'>
          {AssetsData.map((currency) => (
              <Button className={currency.code === selectedCategory ? 'card-selected_button': ''} style={{  width: 120, height: 52, background: currency.color, paddingLeft: "1rem", paddingRight: "1rem", fontWeight: 900,
              fontSize: 18 }}  shape='rounded' onClick={() => fetchRecommendations(currency.code)}>
                <div style={{ display: "flex", justifyContent: "center"}}>
                  <div style={{display: "flex", alignItems: "center", paddingRight: 5}}>
                    {currency.name}
                  </div>
                  <div> 
                    {currency.src ? <Image
                        width={40} height={40}
                    src={ currency.src}
                        alt='test'
                    /> : ''}
                  </div>
                </div>
                
              </Button>
          ))}
      
     
        
      </div>
      <div className="rounded-tl-lg rounded-tr-lg bg-white px-4 pt-6 dark:bg-light-dark md:px-8 md:pt-8">
        <div className="flex flex-col items-center justify-between border-b border-dashed border-gray-200 pb-5 dark:border-gray-700 md:flex-row">
          <h2 className="mb-3 shrink-0 text-lg font-medium uppercase text-black dark:text-black sm:text-xl md:mb-0 md:text-2xl">
            Top Cards
          </h2>
        </div>
      </div>
      <div className="-mx-0.5 dark:[&_.os-scrollbar_.os-scrollbar-track_.os-scrollbar-handle:before]:!bg-white/50">
        <Scrollbar style={{ width: '100%' }} autoHide="never">
          <div className="px-0.5">
            <table
              {...getTableProps()}
              className="transaction-table w-full border-separate border-0"
            >
              <thead className="text-sm text-gray-500 dark:text-gray-300">
                {headerGroups.map((headerGroup, idx) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                    {headerGroup.headers.map((column, idx) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        key={idx}
                        className="group bg-white px-2 py-5 font-normal first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4"
                      >
                        <div className="flex items-center">
                          {column.render('Header')}
                          {column.canResize && (
                            <div
                              {...column.getResizerProps()}
                              className={`resizer ${
                                column.isResizing ? 'isResizing' : ''
                              }`}
                            />
                          )}
                          <span className="ltr:ml-1 rtl:mr-1">
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                  <ChevronDownIcon />
                              ) : (
                                <ChevronDownIcon className="rotate-180" />
                              )
                            ) : (
                              <ChevronDownIcon className="rotate-180 opacity-0 transition group-hover:opacity-50" />
                            )}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                {...getTableBodyProps()}
                className="text-xs font-medium text-gray-900 dark:text-black 3xl:text-sm"
              >
                {page.map((row, idx) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={idx}
                      className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 dark:bg-light-dark"
                    >
                      {row.cells.map((cell, idx) => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            key={idx}
                            className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8 3xl:py-5"
                          >
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Scrollbar>
      </div>
    </div>
  );
}
