

export default function Button({ props }) {
    return (
    <button type='submit' onClick={props.func} id={props.id} className="p-2 bg-red-400 font-semibold rounded text-white mt-3">
        {props.content}
    </button>
    )

}
