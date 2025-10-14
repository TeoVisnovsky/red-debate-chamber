import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Users, Shield, Globe } from "lucide-react";

const CommitteeSelect = () => {
  const navigate = useNavigate();

  const committees = [
    {
      id: "cccp",
      name: "CCCP MUN COMMAND",
      fullName: "The Central Committee of the Communist Party of the Soviet Union",
      icon: Star,
      description: "Experience the power of socialist debate",
      color: "from-red-700 to-red-900",
      textColor: "text-red-500",
      borderColor: "border-red-500",
      route: "/cccp"
    },
    {
      id: "eu",
      name: "EUROPEAN UNION",
      fullName: "European Parliament & Council",
      icon: Globe,
      description: "Modern, sleek design with blue & gold theme",
      color: "from-blue-600 via-blue-500 to-blue-700",
      textColor: "text-blue-400",
      borderColor: "border-blue-400",
      route: "/eu"
    },
    {
      id: "nato",
      name: "NATO",
      fullName: "North Atlantic Treaty Organization",
      icon: Shield,
      description: "Collective defense and security cooperation",
      color: "from-slate-700 to-slate-900",
      textColor: "text-slate-400",
      borderColor: "border-slate-500",
      route: "/nato",
      disabled: true
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 py-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight">
            MUN COMMAND CENTER
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Select Your Committee
          </p>
        </div>

        {/* Committee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {committees.map((committee) => {
            const Icon = committee.icon;
            return (
              <Card
                key={committee.id}
                className={`relative overflow-hidden border-4 ${committee.borderColor} transition-all hover:scale-105 ${
                  committee.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${committee.color} opacity-10`} />
                
                <div className="relative p-8 space-y-4">
                  <div className="flex items-center justify-center">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${committee.color} flex items-center justify-center border-4 ${committee.borderColor}`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <h2 className={`text-2xl font-black ${committee.textColor} tracking-wider`}>
                      {committee.name}
                    </h2>
                    <p className="text-sm text-muted-foreground font-bold">
                      {committee.fullName}
                    </p>
                    <p className="text-sm text-foreground/70 pt-2">
                      {committee.description}
                    </p>
                  </div>

                  <Button
                    onClick={() => !committee.disabled && navigate(committee.route)}
                    disabled={committee.disabled}
                    className={`w-full font-bold text-lg ${
                      committee.disabled ? '' : `bg-gradient-to-br ${committee.color} hover:opacity-90`
                    }`}
                  >
                    {committee.disabled ? 'COMING SOON' : 'ENTER COMMITTEE'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-muted-foreground">
          <p className="text-sm">Model United Nations • Command & Control System</p>
        </div>
      </div>
    </div>
  );
};

export default CommitteeSelect;
