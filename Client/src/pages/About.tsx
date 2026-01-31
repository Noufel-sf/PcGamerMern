import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ConatactCenter from "@/components/ContactCenter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Globe,
  Mail,
  Linkedin,
  Twitter,
  CheckCircle2,
  ArrowRight,
  Target,
} from "lucide-react";
import { aboutValues, aboutTimeline, aboutTeam, aboutStats } from "@/data";

const About = () => {
  return (
    <main className="">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20 ">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              Est. 2026
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Transforming Shopping in{" "}
              <span className="text-primary">Algeria</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed">
              We're on a mission to make online shopping accessible, affordable,
              and delightful for everyone. From tech gadgets to home essentials,
              we bring quality products to your doorstep.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/allproducts">
                  Shop Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 lg:py-24">
        {/* Mission Section */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  Our Mission
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Making Quality Products Accessible to Everyone
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                We started with a simple question: Why should online shopping be
                complicated? In 2020, we set out to build a platform that
                combines the best products, competitive prices, and exceptional
                customer service.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Today, we're proud to serve over 200,000 customers across all 48
                wilayas in Algeria, delivering everything from electronics to
                fashion, all with a smile.
              </p>
              <ul className="space-y-3">
                {[
                  "Free shipping on orders over 5,000 DA",
                  "24/7 customer support in Arabic & French",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
                alt="Our team"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </section>

        <Separator className="my-16" />

        {/* Values Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide every decision we make and every product we
              deliver
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutValues.map((value, idx) => (
              <Card
                key={idx}
                className="hover:shadow-lg transition-shadow group"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-14 h-14 mx-auto mb-4 rounded-full ${value.color} flex items-center justify-center group-hover:scale-110 transition`}
                  >
                    <value.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-lg mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        <ConatactCenter />

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 lg:p-12 text-primary-foreground text-center">
          <Globe className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Get exclusive deals, early access to new products, and be part of
            Algeria's favorite shopping destination
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/allproducts">
                Start Shopping
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <Link to="/help">
                <Mail className="mr-2 w-4 h-4" />
                help center
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default About;
