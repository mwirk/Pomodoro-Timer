export default function SelectList({props}){
    return (
        <div  className='flex flex-col'>
        <label className='flex flex-col'>{props.label}
            <select id={props.id} value={props.value} onChange={props.func} className='mt-2 w-full p-3 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200' >
                { props.arr.map((x,index)=>(<option key={index}>{x.title}</option> )) }
            </select>
        </label>
    </div>
    );

}