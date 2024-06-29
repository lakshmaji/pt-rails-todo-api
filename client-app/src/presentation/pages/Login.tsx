import { useContext } from "react";
import logo from "../../assets/hermit-crab.svg";
import { LoginRequest } from "../../domain/models/User";
import { useLoginUser } from "../../application/hooks/useLoginUser";
import { SubmitHandler, useForm } from "react-hook-form";
import { AuthContext } from "../../AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

type SigninFormInputs = LoginRequest;
const Login = () => {
  const mutation = useLoginUser();
  let location = useLocation();

  let from = location.state?.from?.pathname || "/";
  let navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
    getValues,
  } = useForm<SigninFormInputs>({
    defaultValues: {},
  });
  const { login } = useContext(AuthContext);

  const onSubmit: SubmitHandler<SigninFormInputs> = async (data) => {
    const res = await mutation.mutateAsync(data);
    if (res?.access_token) {
      // assume success
      const created_at = new Date(res.created_at);
      created_at.setSeconds(res.expires_in);
      login(res.access_token, res.refresh_token, created_at);
      // Send them back to the page they tried to visit when they were
      // redirected to the login page. Use { replace: true } so we don't create
      // another entry in the history stack for the login page.  This means that
      // when they get to the protected page and click the back button, they
      // won't end up back on the login page, which is also really nice for the
      // user experience.
      navigate(from, { replace: true });
    }
  };
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 rounded-md bg-white transition-all duration-700 dark:bg-slate-800">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img src={logo} className="mx-auto h-10 w-auto" alt="logo" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
            Sign in to your account
          </h2>
        </div>

        <div className="my-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-300"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  autoComplete="off"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("email", {
                    required: "required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Entered value does not match email format",
                    },
                  })}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-300"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  autoComplete="off"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("password", {
                    required: "You must specify a password",
                  })}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
