

function ProfileCard() {
  return (
    <section className="bg-white w-full md:flex-2/5 flex flex-col gap-7 rounded-lg py-8 px-10 md:p-10">
        <div className="flex justify-between mb-8">
            <span>INFO</span>
            <img src="src\assets\icons\more.svg" alt="more" />
        </div>

        <div className="flex justify-center relative">
            <label htmlFor="avatar-upload" className="cursor-pointer">
                <img src="src\assets\images\logos_visa.png" alt="avatar_profile"  className="w-24 h-24 rounded-full object-cover"
                />
            </label>
        </div>

        <div className="flex flex-col justify-center items-center mb-8">
            <span className="text-[20px] font-semibold">
                Nama User
            </span>

            <span className="text-xsmall-bold text-grey">
                Moviegoers
            </span>
        </div>

        <div className="flex flex-col gap-6">
        <span className="text-medium-bold text-darkgrey ">
          Loyalty Points
        </span>

        <div className="relative flex flex-col justify-between items-start gap-2 bg-primary rounded-lg text-white h-40 p-4 overflow-hidden">
            <span className="text-medium-bold">Moviegoers</span>
            <span className="text-large-bold">
                500 {" "}
                <span className="text-small-normal">points</span>
            </span>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bg-[#FFFFFF4D] rounded-full w-32 h-32 right-0 bottom-25 translate-x-8"></div>
          <div className="absolute bg-[#FFFFFF4D] rounded-full w-32 h-32 right-0 bottom-20 translate-x-15 "></div>
          <img src="src\assets\images\star.svg" alt="star" className="absolute right-0" />
        </div>   
        </div>

        <div className="w-full flex flex-col items-center mt-8">
            <span className="text-medium-normal text-darkgrey">
                180 points become a master
            </span>

            <div className="w-full h-4 bg-gray-300 rounded-lg overflow-hidden">
                <div 
                className="h-full bg-blue-800 roundel-lg"
                style={{
                    width:`${Math.min((50/180) * 100, 100)}%`,
                }}></div>
            </div>
        </div>
      </div>
    </section> 
  )
}

export default ProfileCard