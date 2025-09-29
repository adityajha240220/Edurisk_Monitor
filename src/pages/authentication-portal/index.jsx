import React from 'react';
import { Helmet } from 'react-helmet';
import BrandingHeader from './components/BrandingHeader';
import AuthForm from './components/AuthForm';
import TrustSignals from './components/TrustSignals';

const AuthenticationPortal = () => {
  return (
    <>
      <Helmet>
        <title>Authentication Portal - EduRisk Monitor</title>
        <meta name="description" content="Secure login and registration portal for EduRisk Monitor - Educational Risk Management Platform" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Branding & Information */}
              <div className="space-y-8">
                <BrandingHeader />
                
                {/* Additional Information */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Platform Benefits
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full mt-0.5">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Early Risk Detection</p>
                          <p className="text-xs text-muted-foreground">
                            Identify at-risk students before academic challenges become critical
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-accent/10 rounded-full mt-0.5">
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Automated Interventions</p>
                          <p className="text-xs text-muted-foreground">
                            Smart alert system for timely counseling and support measures
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-success/10 rounded-full mt-0.5">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Data-Driven Insights</p>
                          <p className="text-xs text-muted-foreground">
                            Comprehensive analytics for institutional and ministry-level decisions
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="border-t border-border pt-6">
                    <h4 className="text-sm font-semibold text-foreground mb-4">Platform Impact</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">95%</p>
                        <p className="text-xs text-muted-foreground">Risk Detection Accuracy</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-accent">2.5M+</p>
                        <p className="text-xs text-muted-foreground">Students Monitored</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-success">1,200+</p>
                        <p className="text-xs text-muted-foreground">Institutions Connected</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Signals - Desktop */}
                <div className="hidden lg:block">
                  <TrustSignals />
                </div>
              </div>

              {/* Right Column - Authentication Form */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-8 shadow-card">
                  <AuthForm />
                </div>

                {/* Trust Signals - Mobile */}
                <div className="lg:hidden">
                  <TrustSignals />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border bg-card/50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="text-center sm:text-left">
                <p className="text-xs text-muted-foreground">
                  © {new Date()?.getFullYear()} EduRisk Monitor. All rights reserved.
                </p>
                <p className="text-xs text-muted-foreground">
                  Developed in partnership with Ministry of Education, Government of Rajasthan
                </p>
              </div>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
                <span>•</span>
                <a href="#" className="hover:text-foreground transition-colors">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AuthenticationPortal;