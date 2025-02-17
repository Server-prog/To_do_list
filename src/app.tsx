import { useState , useEffect} from "react"
import  { Pencil, Notebook, Trash2, Rocket, Save, X }from  'lucide-react'

interface Todo{
  id: number,
  text: string,
  completed: boolean;
  createAt : Date;
}

function App() {

  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos).map((todo: Todo) => ({
        ...todo,
        createAt: new Date(todo.createAt),
      }));
    }
    return [];
  });
  
  
  const [inputValue, setInputValue] = useState('');
  const [editingId ,setEditingId] = useState<number | null>(null)
  const [editingText, setEditingText] = useState<string>('');
 


  const starEditing = (todo : Todo) =>{
    setEditingId(todo.id);
    setEditingText(todo.text);
  }
  const cancelEditing = () => {
    setEditingId(null);
    setEditingText('');
  }
  const saveEditing = (id: number) => {
    if(editingText.trim() === '') return;
    setTodos(todos.map(todo => 
      todo.id === id ? {...todo, text: editingText} : todo
    ));
    setEditingId(null);
    setEditingText('');
  };
  

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);


  const handlerAddTodo  = (e : React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    if(inputValue.trim() === ''){
      return;
    }
    const newTodo = {
      id : Date.now(),
      text: inputValue,
      completed: false,
      createAt : new Date(),
    }
    setTodos([...todos, newTodo]);
    setInputValue('');
  }
  const toggleTodo = (id : number) => {
    setTodos(todos.map(todo => 
      todo.id === id? {...todo, completed:!todo.completed} 
      : todo
    ));
  }
  const deleteTodo = (id : number) => {
    setTodos(todos.filter(todo => todo.id!== id));
  }
  return (
    <>
    {/* header aplication */}
      <header className="bg-zinc-900 h-36 flex items-center
       justify-center ">

        <div className="flex gap-2 -translate-y-6">

        <Rocket size={48} className="text-purple-600" />
          <div className="flex">

            <p className="text-4xl text-blue-400 font-black">to</p>

            <p className="text-4xl text-purple-500 font-black">do</p>

            <p className="text-4xl text-purple-800 font-black">-list</p>
          </div>

        </div>

      </header>

          {/* section content */}
          <section className="justify-center flex px-4 sm:px-0">
  <div className="w-full max-w-[736px] flex flex-col items-center justify-center -translate-y-16">
    <div className="flex flex-col gap-2 w-full">
      <p className="text-zinc-500 font-sans">New Task</p>
      <form onSubmit={handlerAddTodo} className="flex flex-nowrap gap-3 items-center justify-center w-full">
        <input 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)}
          type="text" 
          placeholder="Digite uma nova tarefa"
          className="w-full sm:w-[628px] h-[54px] bg-zinc-700 outline-none text-zinc-400 shadow-lg rounded-lg px-4" 
        />
        <button type="submit" className="flex w-20 text-zinc-50 gap-1 rounded-lg shadow-lg bg-blue-500 h-[54px] justify-center items-center">
          <p>Criar</p>
          <img src="public/plus.svg" alt="" />
        </button>
      </form>
    </div>

    <div className="mt-6 flex flex-col w-full max-w-[732px] px-1">
      <p className="text-zinc-500">Tasks</p>
      <div className="flex flex-wrap justify-between mt-3 gap-3">
        <div className="flex gap-1 items-center justify-center">
          <p className="font-bold text-sm text-blue-400">Tarefas Criadas</p>
          <p className="font-bold text-sm text-zinc-100 bg-zinc-500 w-6 h-4 flex items-center justify-center rounded-3xl">{todos.length}</p>
        </div>
        <div className="flex gap-3 items-center justify-center">
          <p className="font-bold text-sm text-purple-500">Concluídas</p>
          <div className="flex rounded-3xl items-center justify-center gap-2 bg-zinc-500 px-3 h-6">
            <p className="font-bold text-sm text-zinc-100 flex items-center justify-center">{todos.filter(todo => todo.completed).length}</p>
            <p className="text-zinc-100">de</p>
            <p className="text-zinc-100">{todos.length}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-4 w-full max-w-[732px]">
      {todos.length > 0 ? (
        <ul className="border rounded-2xl flex flex-col gap-2 border-zinc-700 border-solid">
          {todos.map(todo => (
            <li key={todo.id} className={`flex gap-4 items-center shadow-lg border-none w-full h-[72px] rounded-lg px-3 justify-between ${todo.completed ? 'text-zinc-400 line-through bg-zinc-600' : 'text-zinc-50 bg-zinc-700'}`}>
              <div className="flex gap-2">
                <input className="w-4" type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} disabled={editingId === todo.id} />
                {editingId === todo.id ? (
                  <div className="flex gap-2">
                    <input type="text" value={editingText} onChange={(e) => setEditingText(e.target.value)} autoFocus className="bg-zinc-700 text-zinc-400 px-2 rounded-md" />
                    <div className="flex gap-2">
                      <button onClick={() => saveEditing(todo.id)} className="bg-green-500 px-3 py-1 text-white rounded-lg">
                        <Save />
                      </button>
                      <button onClick={cancelEditing} className="bg-red-500 px-3 py-1 text-white rounded-lg">
                        <X />
                      </button>
                    </div>
                  </div>
                ) : <p>{todo.text}</p>}
              </div>
              <div className="flex items-center justify-center gap-3">
                {editingId !== todo.id && (
                  <button onClick={() => starEditing(todo)} className="text-zinc-500 text-sm flex items-center justify-center" disabled={todo.completed}>
                    <Pencil size={16} className="text-blue-500" /> 
                  </button>
                )}
                <button onClick={() => deleteTodo(todo.id)} className="text-zinc-500 text-sm">
                <Trash2 size={16} className="text-red-500" /> 
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-20 flex flex-col items-center gap-5 justify-center">
          <Notebook size={150} className="text-gray-600" />
          <div>
            <p className="text-zinc-400 text-base">Você ainda não tem tarefas cadastradas</p>
            <p className="text-zinc-500 text-base">Crie tarefas e organize seus itens a fazer</p>
          </div>
        </div>
      )}
    </div>
  </div>
</section>

 {/* section content */}

        
    </>
  )
}

export {App}