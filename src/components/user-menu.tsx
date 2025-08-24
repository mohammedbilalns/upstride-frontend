// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuSeparator,
//   DropdownMenuItem,
// } from "@radix-ui/react-dropdown-menu"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { useState } from "react"
// import { LogOut, PenSquare, UserIcon } from "lucide-react"
// import { toast } from "sonner"
// import { motion } from "framer-motion"
// import { Link } from "@tanstack/react-router"

// interface UserMenuProps {
//   user: User
// }

// export default function UserMenu({ user }: UserMenuProps) {
//   const [isLoading, setIsLoading] = useState(false)

//   const getInitals = (name: string) =>
//     name?.split(" ").map((n) => n[0]).join("").toUpperCase()

//   const handleLogout =  () => {
//     setIsLoading(true)
//     try {
//         console.log("logout")
//     } catch (e) {
//       console.log(e)
//       toast("Failed to logout")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="ghost"
//           className="relative h-9 w-9 rounded-full border bg-background/70 shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:shadow-md"
//         >
//           <Avatar className="h-9 w-9">
//             <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium">
//               {getInitals(user?.name) || "U"}
//             </AvatarFallback>
//           </Avatar>
//         </Button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent
//         align="end"
//         className="w-64 overflow-hidden rounded-2xl border bg-background/70 p-3 shadow-xl backdrop-blur-lg transition-all"
//         asChild
//       >
//         <motion.div
//           initial={{ opacity: 0, y: -8 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.15 }}
//         >
//           {/* User Info */}
//           <div className="mb-2 flex items-center gap-3 rounded-xl bg-muted/40 p-3">
//             <Avatar className="h-10 w-10">
//               <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium">
//                 {getInitals(user?.name) || "U"}
//               </AvatarFallback>
//             </Avatar>
//             <div className="flex flex-col">
//               <p className="text-sm font-semibold">{user.name}</p>
//               <p className="text-xs text-muted-foreground">{user?.email}</p>
//             </div>
//           </div>

//           <DropdownMenuSeparator />

//           {/* Menu Items */}
//           <div className="flex flex-col space-y-1">
//             <DropdownMenuItem asChild>
//               <Link
//                 to={"/profile"}
//                 className="flex items-center gap-2 rounded-lg p-2 text-sm transition-colors hover:bg-muted/30"
//               >
//                 <UserIcon className="h-4 w-4" />
//                 <span>Profile</span>
//               </Link>
//             </DropdownMenuItem>

//             <DropdownMenuItem asChild>
//               <Link
//                 to="/blog/create"
//                 className="flex items-center gap-2 rounded-lg p-2 text-sm transition-colors hover:bg-muted/30"
//               >
//                 <PenSquare className="h-4 w-4" />
//                 <span>Create Blog</span>
//               </Link>
//             </DropdownMenuItem>
//           </div>

//           <DropdownMenuSeparator />

//           <DropdownMenuItem
//             className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-sm text-red-500 transition-colors hover:bg-red-500/10 focus:bg-red-500/10"
//             onClick={handleLogout}
//             disabled={isLoading}
//           >
//             <LogOut className="h-4 w-4" />
//             <span>{isLoading ? "Logging Out..." : "Logout"}</span>
//           </DropdownMenuItem>
//         </motion.div>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }

