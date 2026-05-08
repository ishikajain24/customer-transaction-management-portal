import React, { useState } from 'react'

import user_icon from '../../assets/person.png'
import email_icon from '../../assets/email.png'
import password_icon from '../../assets/password.png'

const LoginSignup = () => {

    const [action, setAction] = useState('Sign Up')

    return (
        <div className="flex flex-col mx-auto mt-[200px] bg-white pb-[30px] w-[600px]">
            
            <div className="flex flex-col items-center gap-[9px] w-full mt-[30px]">
                
                <div className="text-[48px] font-bold text-[#333]">
                    {action}
                </div>

                <div className="flex flex-col gap-[20px] mt-[55px]">
                    
                    {action === "Login" ? null : (
                        <div className="flex items-center mx-auto w-[480px] h-[80px] bg-[#eaeaea] rounded-md">
                            <img src={user_icon} alt="User" className="mx-[30px]" />
                            <input 
                                type="text" 
                                placeholder="Username"
                                className="h-[50px] w-[400px] bg-transparent border-none outline-none text-[19px] text-[#797979]"
                            />
                        </div>
                    )}

                    <div className="flex items-center mx-auto w-[480px] h-[80px] bg-[#eaeaea] rounded-md">
                        <img src={email_icon} alt="Email" className="mx-[30px]" />
                        <input 
                            type="email" 
                            placeholder="Email"
                            className="h-[50px] w-[400px] bg-transparent border-none outline-none text-[19px] text-[#797979]"
                        />
                    </div>

                    <div className="flex items-center mx-auto w-[480px] h-[80px] bg-[#eaeaea] rounded-md">
                        <img src={password_icon} alt="Password" className="mx-[30px]" />
                        <input 
                            type="password" 
                            placeholder="Password"
                            className="h-[50px] w-[400px] bg-transparent border-none outline-none text-[19px] text-[#797979]"
                        />
                    </div>

                </div>

                {action === 'Sign Up' ? null : (
                    <div className="pl-[62px] mt-[27px] text-[#797979] text-[18px]">
                        Lost Password? <span className="text-[#4c00b4] cursor-pointer">Click Here</span>
                    </div>
                )}

                <div className="flex gap-[30px] mx-auto my-[60px]">
                    
                    <div 
                        className={`flex justify-center items-center w-[220px] h-[60px] rounded-full text-[18px] font-bold cursor-pointer ${
                            action === "Login" ? "bg-[#eaeaea] text-[#797979]" : "bg-[#4c00b4] text-white"
                        }`}
                        onClick={() => setAction('Sign Up')}
                    >
                        Signup
                    </div>

                    <div 
                        className={`flex justify-center items-center w-[220px] h-[60px] rounded-full text-[18px] font-bold cursor-pointer ${
                            action === "Sign Up" ? "bg-[#eaeaea] text-[#797979]" : "bg-[#4c00b4] text-white"
                        }`}
                        onClick={() => setAction('Login')}
                    >
                        Login
                    </div>

                </div>

            </div>
        </div>
    )
}

export default LoginSignup