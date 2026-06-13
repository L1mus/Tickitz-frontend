import { useState } from "react"
import SettingAccount from "./SettingAccount"
import OrderHistory from "./OrderHistory"


function CardSettingChoice() {
    const [active, setActive] = useState("account")

  return (
    <div className="flex flex-col w-full">
        <section className="flex flex-row items-start gap-8 p-4 bg-white rounded-lg min-w-0 h-min px-10">
            <button
                onClick={() => setActive("account")}
                className={`flex justify-center items-center text-medium-bold ${
                    active === "account"
                    ? "border-b-2 border-primary text-black"
                    : "text-grey"
                }`}>
              Account Setting
            </button>

            <button
                onClick={() => setActive("order")}
                className={`flex justify-center items-center text-medium-bold ${
                    active === "order"
                    ? "border-b-2 border-primary text-black"
                    : "text-grey"
                }`}>
              Order History
            </button>
        </section>

        <div className="my-10">
            {active === "account" && <SettingAccount/>}
            {active === "order" && <OrderHistory/>}
        </div>

    </div>
  )
}

export default CardSettingChoice