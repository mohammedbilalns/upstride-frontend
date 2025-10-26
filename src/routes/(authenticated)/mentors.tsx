import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutGrid,
  List,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MentorSideBar from "@/features/mentor/components/MentorSideBar";
import { MentorsSearchSchema } from "@/features/mentor/schemas/mentorsSearchSchema";
import { getMentorsForUser } from "@/features/mentor/services/mentor.service";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useInfiniteScroll } from "@/shared/hooks/useInfinteScroll";
import MentorCard from "@/features/mentor/components/MentorCard";
import NoResource from "@/components/common/NoResource";

export const Route = createFileRoute("/(authenticated)/mentors")({
  validateSearch: (search: Record<string, string>) => {
    return MentorsSearchSchema.parse(search);
  },
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps: { search } }) => {
    const limit = 10;
    return getMentorsForUser(
      "1",
      limit.toString(),
      search.query || "",
      search.expertiseId || "",
      search.skillId || "",
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const [limit] = useState(10);
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

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
  useInfiniteQuery({
    queryKey: ["mentors", search.query, search.expertiseId, search.skillId],
    queryFn: ({ pageParam = 1 }) =>
      getMentorsForUser(
        pageParam.toString(),
        limit.toString(),
        search.query || "",
        search.expertiseId || "",
        search.skillId || "",
      ),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.mentors.length < limit) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });

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
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Find Mentors</h1>
        <p className="text-muted-foreground">
          Connect with experienced professionals who can guide you in your
          career journey.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <MentorSideBar search={search} navigate={navigate} />
        {/* Mentors Grid */}
        <div className="w-full md:w-3/4">
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search mentors..."
                className="pl-10"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentors.length > 0 ? (
              mentors.map((mentor) => <MentorCard key={mentor.id} mentor={mentor} />)
            ) : (
                <NoResource resource="mentors" 
                  clearFilters={clearFilters}
                  isSearch={Boolean(search.query || search.expertiseId || search.skillId)}
                />
              )}
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
        </div>
      </div>
    </div>
  );
}
