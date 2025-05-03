
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Container>
          <div className="py-12 md:py-20">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">About Samasya Seva</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Empowering citizens with a direct channel to local government.
              </p>
            </div>

            <div className="space-y-12 mb-16">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-primary">Our Mission</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Samasya Seva is dedicated to bridging the gap between citizens and local government
                    by providing a transparent, efficient platform for reporting and resolving civic issues.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    We believe that every citizen deserves a voice in shaping their community, and that
                    technology can play a vital role in making governance more responsive and accountable.
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
                  <h3 className="text-xl font-semibold mb-3 text-primary">Core Values</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>Transparency in governance and issue resolution</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>Citizen empowerment through technology</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>Efficiency in public service delivery</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>Accountability of public officials</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>Inclusive civic participation</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-12">
                <h2 className="text-2xl font-bold mb-6 text-primary text-center">Our Story</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Founded in 2023, Samasya Seva was born out of a recognition that citizens often face 
                  significant barriers when trying to report and resolve civic issues. Traditional channels
                  were cumbersome, lacked transparency, and provided little visibility into the resolution process.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Our platform was designed to address these challenges by creating a direct, digital channel
                  between citizens and local government. By leveraging technology, we've made it easier for
                  people to report problems, track their resolution, and hold public officials accountable.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Today, Samasya Seva serves the residents of Ajmer, with plans to expand to other cities
                  across Rajasthan and eventually nationwide. Our vision is to become the standard platform
                  for civic issue reporting and resolution throughout India.
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-12">
                <h2 className="text-2xl font-bold mb-6 text-primary text-center">Our Team</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Team Member 1 */}
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
                    <h3 className="font-bold text-lg">Rajiv Sharma</h3>
                    <p className="text-sm text-primary">Founder & CEO</p>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                      Former civil servant with 15 years of experience in public administration.
                    </p>
                  </div>
                  
                  {/* Team Member 2 */}
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
                    <h3 className="font-bold text-lg">Priya Patel</h3>
                    <p className="text-sm text-primary">Chief Technology Officer</p>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                      Tech innovator with expertise in developing civic tech solutions.
                    </p>
                  </div>
                  
                  {/* Team Member 3 */}
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
                    <h3 className="font-bold text-lg">Amit Kumar</h3>
                    <p className="text-sm text-primary">Community Relations</p>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                      Community organizer with deep ties to local government and civic groups.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default About;
