export default function TimerInput({ props }) {
    return (
      <div id={props.id} className="flex flex-col">
      <label>{props.label}</label>
      <input
        id={props.idInput}
        onInput={(e) => {
          const value = e.target.value.replace(/\D/g, "");
          const numericValue = parseInt(value, 10);
    
          
          if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 100) {
            e.target.value = numericValue;
          } else if (value === "") {
            e.target.value = ""; 
          } else {
            e.target.value = props.defaultValue || 1; 
          }
        }}
        onChange={props.func}
        className={`${props.idInput} w-full p-1 mt-2 mb-4 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out`}
        defaultValue={props.defaultValue}
        type="number" 
        required
      />
    </div>
    
    )
}


