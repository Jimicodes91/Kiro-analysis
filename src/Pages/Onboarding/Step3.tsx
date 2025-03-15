// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useDispatch } from 'react-redux';
// import { setAccountDetails, setCurrentStep } from '../../store/onboardingSlice';
// import { AccountDetails } from '../../types';
// import {FormInput} from '../../Components/Form/input';
// import { MainButton} from '../../Components/Form/button';

// const SetupAccountForm: React.FC = () => {
//   const { register, handleSubmit, watch, formState: { errors } } = useForm<AccountDetails & { confirmPassword: string }>();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const dispatch = useDispatch();

//   const password = watch('password', '');

//   const onSubmit = (data: AccountDetails & { confirmPassword: string }) => {
//     const { confirmPassword, ...accountDetails } = data;
//     dispatch(setAccountDetails(accountDetails));
//     // In a real application, you would typically submit the entire onboarding data here
//     alert('Account setup complete!');
//   };

//   const handleBack = () => {
//     dispatch(setCurrentStep(2));
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//       <FormInput
//         id="name"
//         label="Name"
//         register={register}
//         required
//         error={errors.name}
//         placeholder="Name"
//       />

//       <div className="relative">
//         <FormInput
//           id="password"
//           label="Password"
//           register={register}
//           required
//           error={errors.password}
//           type={showPassword ? 'text' : 'password'}
//           placeholder="Password"
//         />
//         <button
//           type="button"
//           className="absolute right-3 top-8 text-gray-500"
//           onClick={togglePasswordVisibility}
//         >
//           {showPassword ? (
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//             </svg>
//           ) : (
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//             </svg>
//           )}
//         </button>
//       </div>

//       <div className="relative">
//         <FormInput
//           id="confirmPassword"
//           label="Confirm password"
//           register={register}
//           required
//           error={errors.confirmPassword}
//           type={showConfirmPassword ? 'text' : 'password'}
//           placeholder="Confirm password"
//         />
//         <button
//           type="button"
//           className="absolute right-3 top-8 text-gray-500"
//           onClick={toggleConfirmPasswordVisibility}
//         >
//           {showConfirmPassword ? (
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//             </svg>
//           ) : (
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//             </svg>
//           )}
//         </button>
//       </div>

//       <div className="flex justify-between pt-4">
//         <MainButton variant="outlined" onClick={handleBack}>
//           Back
//         </MainButton>
//         <Button type="submit">Get started</Button>
//       </div>
//     </form>
//   );
// };

// export default SetupAccountForm;