import { Search, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NoResource from "@/components/common/NoResource";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useInfiniteScroll } from "@/shared/hooks/useInfinteScroll";
import { useState, useEffect } from "react";
import MentorCard from "@/features/mentor-discovery/components/MentorCard";
import MentorSideBar from "@/features/mentor-discovery/components/MentorSideBar";
import { getRouteApi } from "@tanstack/react-router";
import { mentorsQueryOptions } from "../services/mentor.service";

const routeApi = getRouteApi("/(authenticated)/mentors/");

//FIX: uneven design compared to rest of the auth routes 
export default function MentorListPage() {
  const search = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const [searchInput, setSearchInput] = useState(search.query || "");
  const debouncedSearchInput = useDebounce(searchInput, 500);

  useEffect(() => {
    if (debouncedSearchInput !== search.query) {
      navigate({
        search: (prev) => ({
          ...prev,
          query: debouncedSearchInput || undefined,
        }),
      });
    }
  }, [debouncedSearchInput, search.query, navigate]);

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useSuspenseInfiniteQuery(
      mentorsQueryOptions(
        search.query,
        search.expertiseId,
        search.skillId,
      ),
    );

  const mentors = data?.pages.flatMap((page) => page.mentors) || [];

  const { setTarget } = useInfiniteScroll({
    onIntersect: () => fetchNextPage(),
    hasNextPage: !!hasNextPage,
    isFetching: isFetchingNextPage,
  });

  const clearFilters = () => {
    navigate({ search: {} });
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Find Mentors</h1>
            <p className="text-muted-foreground">
              Connect with experienced professionals who can guide you in your career journey.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Filters (Top on Mobile) */}
          <aside className={`${isMobile ? "w-full" : "w-full lg:w-1/4"
            } space-y-6 lg:sticky lg:top-6 self-start h-fit z-10`}>
            {/* Removed standalone Filters island */}
            <MentorSideBar search={search} navigate={navigate} />
          </aside>

          {/* Main Content - Mentors Grid */}
          <section className={`${isMobile ? "w-full" : "w-full lg:w-3/4"
            } space-y-6`}>
            {/* Header / Search Bar */}
            <div className="bg-card rounded-xl shadow-sm border border-border/50 p-4">
              <div className="flex items-center gap-2">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search mentors..."
                    className="pl-10"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>

                {/* View Toggle */}
                <div className="flex space-x-1 shrink-0">
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Mentors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {mentors.length > 0 ? (
                  mentors.map((mentor) => (
                    <motion.div
                      key={mentor.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MentorCard mentor={mentor} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full">
                    <NoResource
                      resource="mentors"
                      clearFilters={clearFilters}
                      isSearch={Boolean(
                        search.query || search.expertiseId || search.skillId,
                      )}
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Intersection Observer Target */}
            <div ref={setTarget} className="mt-6 flex justify-center">
              {isFetchingNextPage && (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
              {!hasNextPage && mentors.length > 0 && (
                <p className="text-muted-foreground text-sm">
                  You've reached the end of the list
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
