'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  {h:'8am',a:12,b:8,c:5},{h:'9am',a:28,b:20,c:14},{h:'10am',a:44,b:32,c:22},
  {h:'11am',a:62,b:50,c:35},{h:'12pm',a:88,b:66,c:46},{h:'1pm',a:104,b:82,c:58},
  {h:'2pm',a:128,b:96,c:68},{h:'3pm',a:142,b:112,c:80},{h:'4pm',a:158,b:124,c:91},
]

export function VotesChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barCategoryGap="30%" barGap={2}>
        <XAxis dataKey="h" tick={{fill:'#94A3B8',fontSize:11}} axisLine={false} tickLine={false}/>
        <YAxis tick={{fill:'#94A3B8',fontSize:11}} axisLine={false} tickLine={false}/>
        <Tooltip contentStyle={{background:'#1E2A47',border:'none',borderRadius:8,color:'#fff',fontSize:12}} cursor={{fill:'rgba(255,255,255,0.03)'}}/>
        <Bar dataKey="a" name="Candidate A" fill="#4F46E5" radius={[4,4,0,0]}/>
        <Bar dataKey="b" name="Candidate B" fill="#10B981" radius={[4,4,0,0]}/>
        <Bar dataKey="c" name="Candidate C" fill="#F59E0B" radius={[4,4,0,0]}/>
      </BarChart>
    </ResponsiveContainer>
  )
}
