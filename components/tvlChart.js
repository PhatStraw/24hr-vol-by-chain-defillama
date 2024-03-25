import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BlockchainTVLChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'TVL',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1,
    }],
  });

//   useEffect(() => {
//     const fetchTVLData = async () => {
//       const response = await fetch(`https://api.llama.fi/v2/chains`);
//       const data = await response.json();
  
//       // Filter out Ethereum, Tron, and BSC before sorting
//       const filteredData = data.filter(protocol => 
//         protocol.name.toLowerCase() !== 'ethereum' && 
//         protocol.name.toLowerCase() !== 'tron' && 
//         protocol.name.toLowerCase() !== 'bsc'
//       );
  
//       // Sort the filtered data based on TVL in descending order and slice the top ten
//       const topTenData = filteredData.sort((a, b) => b.tvl - a.tvl).slice(0, 10);
  
//       const labels = topTenData.map(protocol => protocol.name);
//       const tvlData = topTenData.map(protocol => protocol.tvl);
//       const backgroundColors = topTenData.map((_, index) => `rgba(${255 - (index * 30) % 255}, ${99 + (index * 30) % 156}, ${132 + (index * 30) % 123}, 0.2)`);
//       const borderColors = topTenData.map((_, index) => `rgba(${255 - (index * 30) % 255}, ${99 + (index * 30) % 156}, ${132 + (index * 30) % 123}, 1)`);
  
//       setChartData({
//         labels: labels,
//         datasets: [{
//           label: 'TVL',
//           data: tvlData,
//           backgroundColor: backgroundColors,
//           borderColor: borderColors,
//           borderWidth: 1,
//         }],
//       });
//     };
  
//     fetchTVLData();
//   }, []);
useEffect(() => {
    const fetchTVLData = async () => {
      const response = await fetch(`https://api.llama.fi/overview/dexs?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyVolume`);
      const { protocols } = await response.json();

      // Aggregate breakdown24h by chain
      const aggregatedByChain = protocols.reduce((acc, protocol) => {
        Object.entries(protocol.breakdown24h || {}).forEach(([chain, value]) => {
          const volume = Object.values(value)[0]; // Assuming the value is an object with the protocol name as key and volume as value
          if (volume) {
            acc[chain] = (acc[chain] || 0) + volume;
          }
        });
        return acc;
      }, {});
  
      // Convert the aggregated object into an array of { chain, volume } objects
      const aggregatedArray = Object.entries(aggregatedByChain).map(([chain, volume]) => ({
        chain,
        volume
      }));
  
      // Sort by volume in descending order and slice the top 10
      const topTenChains = aggregatedArray.sort((a, b) => b.volume - a.volume).slice(0, 10);
  
      // Prepare labels and data for the chart
      const labels = topTenChains.map(entry => entry.chain);
      const tvlData = topTenChains.map(entry => entry.volume);
      const backgroundColors = labels.map((_, index) => `rgba(${255 - (index * 30) % 255}, ${99 + (index * 30) % 156}, ${132 + (index * 30) % 123}, 0.2)`);
      const borderColors = labels.map((_, index) => `rgba(${255 - (index * 30) % 255}, ${99 + (index * 30) % 156}, ${132 + (index * 30) % 123}, 1)`);
  
      setChartData({
        labels: labels,
        datasets: [{
          label: '24h Volume by Chain',
          data: tvlData,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        }],
      });
    };
  
    fetchTVLData();
  }, []);

  return <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />;
};

export default BlockchainTVLChart;