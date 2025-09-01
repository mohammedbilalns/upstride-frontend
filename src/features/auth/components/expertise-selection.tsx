// import { useState} from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { CheckCircle, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
// import { useFetchExpertiseAreas } from "../hooks/useFetchExpertiseAreas";
// import { useFetchSkillsByAreas } from "../hooks/useFetchSkillsByAreas";
// import { useSaveInterests } from "../hooks/useSaveInterests";
//
// interface ExpertiseArea {
//   id: string;
//   name: string;
//   description: string;
// }
//
// interface Topic {
//   id: string;
//   name: string;
//   areaId: string;
// }
//
// interface ExpertiseSelectionProps {
//   onComplete: () => void;
// }
//
// export default function ExpertiseSelection({
//   onComplete,
// }: ExpertiseSelectionProps) {
//  	const { data:expertiseData, isLoading:isLoadingExpertise } = useFetchExpertiseAreas();
// 	const expertiseAreas: ExpertiseArea[] = expertiseData?.expertises || [];
// 	const { data:skillsData, isLoading:isLoadingSkills } = useFetchSkillsByAreas(expertiseAreas.map(area => area.id));
// 	const skillsByAreas: Topic[] = skillsData?.skills || [];
//   const [topics, setTopics] = useState<Topic[]>([]);
//   const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
// 	console.log("selected areas", selectedAreas);
//   const [selectedTopics, setSelectedTopics] = useState<string[]>([]); 
//   const [activeStep, setActiveStep] = useState<"areas" | "topics">("areas");
//   const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
// 	const saveInterestsMutation = useSaveInterests();
//
//
//   const toggleAreaSelection = (areaId: string) => {
//     if (selectedAreas.includes(areaId)) {
//       setSelectedAreas(selectedAreas.filter((id) => id !== areaId));
//     } else if (selectedAreas.length < 3) {
//       setSelectedAreas([...selectedAreas, areaId]);
//     }
//   };
//
//   const toggleTopicSelection = (topicId: string) => {
//     if (selectedTopics.includes(topicId)) {
//       setSelectedTopics(selectedTopics.filter((id) => id !== topicId));
//     } else {
//       setSelectedTopics([...selectedTopics, topicId]);
//     }
//   };
//
//   const getTopicsForArea = (areaId: string) => {
//     return topics.filter((topic) => topic.areaId === areaId);
//   };
//
//   const isTopicSelected = (topicId: string) => {
//     return selectedTopics.includes(topicId);
//   };
//
//   const handleSubmit = async () => {
//     saveInterestsMutation.mutate({selectedAreas,selectedTopics}) 
//   };
//
//   const canSubmit =
//     selectedAreas.length > 0 &&
//     selectedAreas.every((areaId) => {
//       const areaTopics = getTopicsForArea(areaId);
//       return areaTopics.some((topic) => selectedTopics.includes(topic.id));
//     });
//
//   const proceedToTopics = () => {
//     if (selectedAreas.length > 0) {
//       setActiveStep("topics");
//       setCurrentAreaIndex(0);
//     }
//   };
//
//   const goToPreviousArea = () => {
//     if (currentAreaIndex > 0) {
//       setCurrentAreaIndex(currentAreaIndex - 1);
//     }
//   };
//
//   const goToNextArea = () => {
//     if (currentAreaIndex < selectedAreas.length - 1) {
//       setCurrentAreaIndex(currentAreaIndex + 1);
//     }
//   };
//
//   const currentAreaId = selectedAreas[currentAreaIndex];
//   const currentArea = expertiseAreas.find((a) => a.id === currentAreaId);
//   const currentTopics = currentAreaId ? getTopicsForArea(currentAreaId) : [];
//
//   return (
//     <div className="w-full max-w-2xl mx-auto">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
//           Select Your Expertise
//         </h1>
//         <p className="text-muted-foreground text-lg">
//           Choose up to 3 areas of expertise and select topics within each area
//         </p>
//       </div>
//
//       <Card className="bg-gradient-to-br from-card/80 to-card/60 rounded-2xl shadow-2xl border border-border/50 backdrop-blur-xl overflow-hidden">
//         <CardHeader className="pb-4">
//           <div className="flex justify-between items-center">
//             <CardTitle className="text-xl">
//               {activeStep === "areas" ? "Areas of Expertise" : "Select Topics"}
//             </CardTitle>
//             {activeStep === "areas" && (
//               <CardDescription>
//                 {selectedAreas.length}/3 selected
//               </CardDescription>
//             )}
//           </div>
//         </CardHeader>
//
//         <CardContent className="space-y-6">
//           {isLoadingExpertise ? (
//             <div className="flex justify-center py-8">
//               <Loader2 className="h-8 w-8 animate-spin text-primary" />
//             </div>
//           ) : activeStep === "areas" ? (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
//                 {expertiseAreas.map((area) => (
//                   <Card
//                     key={area.id}
//                     className={`cursor-pointer transition-all duration-300 h-full ${
//                       selectedAreas.includes(area.id)
//                         ? "border-primary/50 bg-primary/5 shadow-md"
//                         : "border-border/50 hover:border-primary/30 hover:bg-primary/5"
//                     }`}
//                     onClick={() => toggleAreaSelection(area.id)}
//                   >
//                     <CardContent className="p-4">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h3 className="font-semibold">{area.name}</h3>
//                           <p className="text-sm text-muted-foreground mt-1">
//                             {area.description}
//                           </p>
//                         </div>
//                         {selectedAreas.includes(area.id) && (
//                           <CheckCircle className="h-5 w-5 text-primary" />
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//
//               <div className="pt-4 flex justify-center">
//                 <Button
//                   onClick={proceedToTopics}
//                   disabled={selectedAreas.length === 0}
//                   className="w-full max-w-xs"
//                 >
//                   Continue to Topic Selection
//                   <ChevronRight className="ml-2 h-4 w-4" />
//                 </Button>
//               </div>
//             </>
//           ) : (
//             <>
//               {/* Area Navigation */}
//               <div className="flex items-center justify-between mb-4">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={goToPreviousArea}
//                   disabled={currentAreaIndex === 0}
//                 >
//                   <ChevronLeft className="mr-1 h-4 w-4" />
//                   Previous
//                 </Button>
//
//                 <div className="flex items-center space-x-2">
//                   {selectedAreas.map((areaId, index) => {
//                     const area = expertiseAreas.find((a) => a.id === areaId);
//                     return (
//                       <div
//                         key={areaId}
//                         className={`w-3 h-3 rounded-full ${
//                           index === currentAreaIndex
//                             ? "bg-primary"
//                             : "bg-muted-foreground/30"
//                         }`}
//                         title={area?.name}
//                       />
//                     );
//                   })}
//                 </div>
//
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={goToNextArea}
//                   disabled={currentAreaIndex === selectedAreas.length - 1}
//                 >
//                   Next
//                   <ChevronRight className="ml-1 h-4 w-4" />
//                 </Button>
//               </div>
//
//               {/* Current Area Header */}
//               <div className="mb-6">
//                 <h3 className="text-xl font-semibold text-primary">
//                   {currentArea?.name}
//                 </h3>
//                 <p className="text-muted-foreground">
//                   {currentArea?.description}
//                 </p>
//               </div>
//
//               {/* Topics Grid */}
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2">
//                 {currentTopics.map((topic) => (
//                   <Badge
//                     key={topic.id}
//                     variant={isTopicSelected(topic.id) ? "default" : "outline"}
//                     className={`cursor-pointer transition-all justify-center py-2 ${
//                       isTopicSelected(topic.id)
//                         ? "bg-primary text-primary-foreground"
//                         : "hover:bg-primary/10"
//                     }`}
//                     onClick={() => toggleTopicSelection(topic.id)}
//                   >
//                     {topic.name}
//                   </Badge>
//                 ))}
//               </div>
//
//               {/* Progress Summary */}
//               <div className="pt-4 border-t border-border/50">
//                 <div className="flex justify-between text-sm text-muted-foreground mb-2">
//                   <span>
//                     Area {currentAreaIndex + 1} of {selectedAreas.length}
//                   </span>
//                   <span>
//                     {currentTopics.filter((t) => isTopicSelected(t.id)).length}{" "}
//                     of {currentTopics.length} topics selected
//                   </span>
//                 </div>
//
//                 <div className="w-full bg-muted rounded-full h-2">
//                   <div
//                     className="bg-primary h-2 rounded-full"
//                     style={{
//                       width: `${
//                         (currentTopics.filter((t) => isTopicSelected(t.id))
//                           .length /
//                           currentTopics.length) *
//                         100
//                       }%`,
//                     }}
//                   />
//                 </div>
//               </div>
//
//               {/* Action Buttons */}
//               <div className="pt-6 flex justify-between">
//                 <Button
//                   variant="outline"
//                   onClick={() => setActiveStep("areas")}
//                 >
//                   <ChevronLeft className="mr-2 h-4 w-4" />
//                   Back to Areas
//                 </Button>
//
//                 <Button
//                   onClick={handleSubmit}
//                   disabled={!canSubmit || saveInterestsMutation.isPending}
//                   className="w-full max-w-xs"
//                 >
//                   {saveInterestsMutation.isPending ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     "Complete Setup"
//                   )}
//                 </Button>
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
