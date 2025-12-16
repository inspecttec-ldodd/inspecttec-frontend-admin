import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/services/auth/msalConfig";
import { useState } from "react";

export function Login() {
    const { instance, inProgress } = useMsal();
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleLogin = () => {
        if (inProgress !== "none") return;

        setIsLoggingIn(true);
        instance.loginRedirect(loginRequest)
            .catch((e) => {
                console.error(e);
                setIsLoggingIn(false);
            });
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
            <div className="p-8 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 text-center max-w-md w-full">
                <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Sign in to manage InspectTec</p>

                <button
                    onClick={handleLogin}
                    disabled={isLoggingIn || inProgress !== "none"}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoggingIn || inProgress !== "none" ? "Processing..." : "Sign in with Microsoft"}
                </button>
            </div>
        </div>
    );
}
