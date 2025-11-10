
// menu principal del sistema
import BuscarTrabajador from "./(features)/buscarTrabajadores/BuscarTrabajador"
import { IoAdd, IoStatsChart, IoPersonAdd, IoRemove } from "react-icons/io5";


export default function Page() {

    const boxes = [
    {
      value: 1249,
      label: "Promedio Trabajadores",
      bgColor: "bg-[#17A2B8]",
      icon: <IoAdd className="text-4xl" />,
    },
    {
      value: 1532,
      label: "Físicos",
      bgColor: "bg-[#28A745]",
      icon: <IoStatsChart className="text-4xl" />,
    },
    {
      value: 831,
      label: "Físicos Mujeres",
      bgColor: "bg-[#FFC107]",
      icon: <IoPersonAdd className="text-4xl" />,
    },
    {
      value: 508,
      label: "Interruptos",
      bgColor: "bg-[#DC3545]",
      icon: <IoRemove className="text-4xl" />,
    },
  ];

  return (
    <>
    <div className="flex flex-wrap -mx-2 p-4">
      {boxes.map((box, index) => (
        <div key={index} className="w-1/2 lg:w-1/4 px-2 mb-4">
          <div className={`rounded-lg shadow p-4 text-white ${box.bgColor} flex justify-between items-center`}>
            <div>
              <h3 className="text-4xl font-bold">{box.value}</h3>
              <p>{box.label}</p>
            </div>
            <div className="text-4xl">{box.icon}</div>
          </div>
        </div>
      ))}
    </div>
    <BuscarTrabajador />
    </>
  ) 
}
