import React, {useState} from 'react'
// import {analytics} from 'firebase'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import {useNavigate} from 'react-router-dom'
import {auth} from '../firebase/Firebase'

function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [conformPassword, setConformPassword] = useState('')
  const navigate = useNavigate()
  const onSubmit = async e => {
    e.preventDefault()
    console.log('hello')
    await createUserWithEmailAndPassword(auth, email, password, conformPassword)
      .then(userCredential => {
        console.log(userCredential)
        const user = userCredential.user
        console.log(user)
        navigate('/')
      })
      .catch(error => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)
      })
  }

  return (
    <>
      <div>
        <div className="bg-gray-200 py-20">
          <div className="w-9/12 mx-auto bg-white py-14 shadow">
            <div className="bg-white lg:mx-48 xl:mx-48 md:mx-48">
              <form onSubmit={onSubmit} className="">
                <div className="mb-14">
                  <h1 className="font-sans text-2xl font-semibold not-italic text-center text-current">
                    You Did It!
                  </h1>
                  <h1 className="font-sans text-2xl font-semibold not-italic text-center text-current">
                    Tell Us Little About Yourself.
                  </h1>
                </div>
                <div className="flex  my-6 justify-between">
                  <div className="flex flex-col w-6/12">
                    <label
                      htmlFor="email"
                      className="font-sans text-base font-semibold not-italic  "
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="JohnDoe"
                      required
                      className="w-11/12 font-sans  font-semibold not-italic  text-current border rounded p-3 outline-none"
                    />
                  </div>
                  <div className="flex flex-col w-6/12">
                    <label
                      htmlFor="email"
                      className="font-sans text-base font-semibold not-italic  "
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      placeholder="xyz@gmail.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-11/12 font-sans  font-semibold not-italic  text-current border rounded p-3 outline-none"
                    />
                  </div>
                </div>
                <div className="flex my-6 justify-between">
                  <div className="flex flex-col w-6/12">
                    <label
                      htmlFor="password"
                      className=" font-sans text-base font-semibold not-italic  "
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      placeholder="*****"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="w-11/12 font-sans  font-semibold not-italic  text-current border rounded p-3 outline-none"
                    />
                  </div>
                  <div className="flex flex-col w-6/12">
                    <label
                      htmlFor="password"
                      className=" font-sans text-base font-semibold not-italic  "
                    >
                      Conform Password
                    </label>
                    <input
                      type="password"
                      id="conform password"
                      placeholder="*****"
                      value={conformPassword}
                      onChange={e => setConformPassword(e.target.value)}
                      required
                      className="w-11/12 font-sans  font-semibold not-italic  text-current border rounded p-3 outline-none"
                    />
                  </div>
                </div>

                <div className="text-center mt-28">
                  <button
                    type="submit"
                    className="cursor-pointer rounded outline-none border  text-white py-4 px-24 font-sans  font-semibold  !bg-[#f14536]"
                  >
                    SignUp
                  </button>
                  <a href="/">
                    <h1 className="text-[#f14536] cursor-pointer font-sans text-base font-semibold not-italic text-center mt-6">
                      Already have an account?
                    </h1>
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp
