import { AuthSchema } from "@mahendra2002/myblogs-common";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AuthSignup = () => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<AuthSchema>({
        email: "",
        name: "",
        password: ""
    })

    async function sendRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, postInputs);
            const jwt = response.data;
            localStorage.setItem("token", jwt)
            navigate('/blogs')
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                alert(err.response?.data || "Signup failed");
                console.error("Axios error:", err.response);
            } else {
                console.error("Unexpected error:", err);
                alert("Something went wrong.");
            }
        }
    }
    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
            <div className="px-10">
                <div className="text-3xl font-extrabold">
                    Create An Account
                </div>
                <div className="text-slate-400">
                    Already have an Account?
                    <Link className="pl-2 underline" to="/signin">Login</Link>
                </div>
            </div>
                <div className="pt-4">
                    <LabelInput 
                        label="Name" 
                        placeholder="Mahendra Pratap Singh..." 
                        onChange={(e) => {setPostInputs((c) => ({
                        ...c,
                        name: e.target.value
                    }))} }/>
                     <LabelInput 
                        label="Email" 
                        placeholder="Mahendra@gmail.com" 
                        onChange={(e) => {setPostInputs((c) => ({
                        ...c,
                        email: e.target.value
                    }))} }/>
                    <LabelInput 
                        label="Password" 
                        placeholder="********" 
                        type={"password"}
                        onChange={(e) => {setPostInputs((c) => ({
                        ...c,
                        password: e.target.value
                    }))} }/>
                    <button onClick={sendRequest} type="button" className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-4 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Sign Up</button>
                </div>
            </div>
        </div>
    </div>
}

interface LabelInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelInput({label, placeholder, onChange, type}: LabelInputType ){
    return <div className="w-full max-w-sm min-w-[200px]">
        <label className="block mb-2 text-sm font-bold text-slate-600">
            {label}
        </label>
        <input onChange={onChange} type={type || "text"} className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow mb-2" placeholder={placeholder} required/>
  </div>
}