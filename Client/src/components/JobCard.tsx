import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye ,MapPin ,DollarSign ,Clock } from "lucide-react";


const JobCard = ({ job }: { job: any }) => {
  return (
    <Card className="cursor-pointer bg-secondary shadow-lg transition-all duration-300 border-0 overflow-hidden">
      <CardContent className="p-6 ">
        {/* Company Logo & Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              {/* <p className="text-sm font-semibold text-muted-foreground">
                {job.company}
              </p> */}
              <p className="text-gray-400">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo pariatur eos tenetur</p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="font-semibold px-3 py-1 bg-gradient-to-r from-primary/10 to-primary/20 text-primary hover:from-primary/20 hover:to-primary/30"
          >
            {job.type}
          </Badge>
        </div>

        {/* Job Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{job.experience}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-4 border-t border-border/50">
         
          <div className="ml-auto">
            <Button
              variant="primary"
              size="sm"
              className="h-8 px-4 text-xs font-semibold  "
            >
              Apply Now
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;