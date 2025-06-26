import HeroSection from "@/components/hero";
import { Button} from "@/components/ui/button";
import { Card,CardContent,CardFooter } from "@/components/ui/card";
import { featuresData, howItWorksData, statsData, testimonialsData } from "@/data/landing";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return(
    <div className="mt-40">
      <HeroSection />
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((statsData,index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2" >{statsData.value}</div>
                <div className="text-gray-600 ">{statsData.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Master your money with ease — your all-in-one solution for financial success!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature,index) =>(
              <Card key={index} className="p-6">
                <CardContent className="space-y-4 pt-4">
                  <h1>{feature.icon}</h1>
                   <p className="text-xl font-semibold">{feature.title}</p>
                    <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            Here’s how it works — simple, seamless, and stress-free!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksData.map((step,index) =>(
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-4 ">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
           Hear it from our users—real stories, real success!

          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial,index) =>(
              <Card key={index} className="p-6">
                <CardContent className="pt-4">
                 <div className="flex items-center mb-4 "><Image src={testimonial.image} width={40} height={40}
                 alt={testimonial.name} className="rounded-full"
                 />
                 <div className="ml-4">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm test-gray-600">{testimonial.role}</div>
                 </div>
                 </div>
                 <p className="pt-4 text-gray-600">{testimonial.quote}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 bg-blue-600 ">
        <div className="container mx-auto px-4 text-center" >
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
          Ready to take charge of your finances? Let’s get started!
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">Join thousands who trust Welth to simplify and supercharge their financial journey!</p>
          <Link href="/dashboard" passHref>
  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 animate-bounce">
    Get Started
  </Button>
</Link>
        </div>

      </section>
    </div>
  )
  
}
