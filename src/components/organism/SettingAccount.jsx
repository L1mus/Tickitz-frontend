import InputField from "../atoms/Input"


function SettingAccount() {
  return (
    <div className="w-full text-darkgrey">
        <div className="bg-white rounded-lg p-10">
            <h2 className="text-large-bold text-black border-b-2 mb-6 border-grey pb-2">
                Details Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:text-xl">
                <div>
                    <label className=" mb-1">First Name</label>
                    <InputField
                        placeholder="Input Your First Name"
                        className="w-full"
                    />
                </div>

                <div>
                    <label className=" mb-1">Last Name</label>
                    <InputField
                        placeholder="Input Your Last Name"/>
                </div>

                <div>
                    <label className=" mb-1">Email</label>
                    <InputField
                        placeholder="Input Your Email"/>
                </div>

                 <div>
                    <label className=" mb-1">Phone</label>
                    <InputField
                        placeholder="Input Your Phonen Number"/>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-lg p-10 md:mt-10 md:text-xl" >
            <div >
             <h2 className="text-large-bold text-black border-b-2 mb-6 border-grey pb-2">Change Password</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div >
                    <label className=" mb-1">New Password</label>
                    <InputField
                        type="password"
                        placeholder="Input New Password"/>
                </div>

                <div>
                    <label className=" mb-1">Confirm Password</label>
                    <InputField
                        type="password"
                        placeholder="Input Confirm password"/>
                </div>
            </div>
           
            </div>
        </div>

    <div className="flex justify-center items-center md:justify-start md:mt-10">
        <button
            type="button"
            className="bg-primary cursor-pointer text-white text-medium-normal py-2 px-6 md:px-36 rounded-lg">
            Update Change
        </button>

    </div>
    </div>
  )
}

export default SettingAccount