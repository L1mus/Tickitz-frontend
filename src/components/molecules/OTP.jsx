import React from 'react'

function OtpInput({ otp = [], inputRefs, handleChange, handleKeyDown, handlePaste }) {
    const otpArray = otp.length === 6 ? otp : new Array(6).fill('')

    return (
        <div className='my-8 flex justify-center gap-2 sm:gap-4'>
            {otpArray.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        if (inputRefs && inputRefs.current) {
                            inputRefs.current[index] = el
                        }
                    }}
                    type='text'
                    inputMode='numeric'
                    maxLength='1'
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className='h-14 w-12 sm:h-16 sm:w-14 rounded-xl border-2 border-gray-300 bg-white text-center text-2xl font-bold text-gray-800 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]'
                />
            ))}
        </div>
    )
}

export default OtpInput