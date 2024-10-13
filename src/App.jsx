import React, { useEffect } from 'react';
import Map from './Map';
import { useState } from 'react';

function App() {
    
    const [StateName,setState] =useState("India");
    const [info,setInfo]=useState("");
    useEffect(()=>{
    
        fetch("/india_state_info.json")
        .then((response)=>{
            return response.json();
        }).then((i)=>{
                
                
                setInfo(i[StateName]);
        })

    },[StateName])

    


    return (<>
    
    <div className='flex flex-row overflow-hidden'>
    <div className='bg-slate-600 w-[50vw] h-[100vh]  '>
        <div className='text-6xl h-[20vh] p-4  text-center font-bold text-[white] my-[10vh]'>{StateName}</div>
        <div className='w-[30vw] text-center text-[white] m-auto my-[5vh] text-3xl'>
            
            {!info ? ((<><div class="relative flex w-64 animate-pulse gap-2 p-4">

<div class="flex-1">
  <div class="mb-1 h-5 w-3/5 rounded-lg bg-slate-400 text-lg"></div>
  <div class="h-5 w-[90%] rounded-lg bg-slate-400 text-sm"></div>
</div>
<div class="absolute bottom-5 right-0 h-4 w-4 rounded-full bg-slate-400"></div>
</div></>)) : info}
            
            </div>
    </div>
    <div className='w-[50vw] h-[100vh]'>

        <Map setState={setState}   />
    </div>
    </div>
    
    
    </> );
}

export default App;