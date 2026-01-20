import Link from "next/link"
import { Scale, Twitter, Linkedin, Github } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import SiteLogo from "./SiteLogo"
import { Insta, Tweeter, Youtube, Facebook } from "@/components/svg";

export function Footer() {
    return (
        <footer className="border-t border-border bg-(--footer-bg)">
            <div className="footerWrapper px-4 py-12">
                <div className="flex justify-between [@media(max-width:1280px)]:flex-wrap gap-12 lg:px-20">
                    {/* Brand */}
                    <div className="space-y-4 max-w-57.5">
                        <SiteLogo className="" logoWhite={true} />
                        <p className="txtSub font-light text-(--sub-white)">
                            Did you come here for something in particular or just general case study
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="max-w-80 w-full">
                        <h4 className="font-medium subTxt mb-4 text-white font-circular">Quick Links</h4>
                        <ul className="space-y-2 flex flex-wrap">
                            <li className="w-[50%]">
                                <Link href="/" className="txtSub block text-left font-light text-(--sub-white) hover:text-primary transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li className="w-[50%]">
                                <Link href="/" className="txtSub block text-left font-light text-(--sub-white) hover:text-primary transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li className="w-[50%]">
                                <Link href="/" className="txtSub block text-left font-light text-(--sub-white) hover:text-primary transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li className="w-[50%]">
                                <Link href="/contact" className="txtSub block text-left font-light text-(--sub-white) hover:text-primary transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li className="w-[50%]">
                                <Link href="/cases" className="txtSub block text-left font-light text-(--sub-white) hover:text-primary transition-colors">
                                    Case reference
                                </Link>
                            </li>
                            <li className="w-[50%]">
                                <Link href="/terms-and-condition" className="txtSub block text-left font-light text-(--sub-white) hover:text-primary transition-colors">
                                    Terms & Condition
                                </Link>
                            </li>
                            <li className="w-[50%]">
                                <Link href="/" className="txtSub block text-left font-light text-(--sub-white) hover:text-primary transition-colors">
                                    Blogs
                                </Link>
                            </li>
                            <li className="w-[50%]">
                                <Link href="/privacy-policy" className="txtSub block text-left font-light text-(--sub-white) hover:text-primary transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="max-w-40 w-full">
                        <h4 className="font-medium subTxt mb-4 text-white font-circular">Contact</h4>
                        <ul className="space-y-2">
                            <li className="txtSub font-light text-(--sub-white) hover:text-primary transition-colors"><a href="mailto:info@legalcaseai.com">info@legalcaseai.com</a></li>
                            <li className="txtSub font-light text-(--sub-white) hover:text-primary transition-colors"><a href="tel:+919876543210">+91 9876543210</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="max-w-full [@media(min-width:600px)]:max-w-1/2 [@media(min-width:1300px)]:max-w-115 w-full">
                        <h4 className="font-medium subTxt mb-4 text-white font-circular">Join Our Newsletter</h4>
                        <div className="flex items-center gap-1 relative bg-secondary rounded-full p-2">
                            <Input type="email" placeholder="Your Email" className="bg-secondary outline-none border-none shadow-none focus:ring-0 focus-visible:border-none focus-visible:ring-0 txtSub" />
                            <Button className="rounded-full body md:py-2 md:px-5 lg:py-4 lg:px-10 h-auto cursor-pointer">Subscribe</Button>
                        </div>
                        <h4 className="font-semibold body-sub mb-4 text-white font-noto mt-10">follow on:</h4>
                        <div className="flex gap-4 mt-4">
                            <Link href="#" className="hover:text-(--btn-bg) transition-colors border border-[#777777] rounded-lg hover:border-(--btn-bg) text-[#777777]">
                                <Insta className="transition-colors text-[#777777] group-hover:text-(--btn-bg)" />
                            </Link>
                            <Link href="#" className="hover:text-(--btn-bg) transition-colors border border-[#777777] rounded-lg hover:border-(--btn-bg) text-[#777777]">
                                <Facebook className="transition-colors text-[#777777] group-hover:text-(--btn-bg)" />
                            </Link>
                            <Link href="#" className="hover:text-(--btn-bg) transition-colors border border-[#777777] rounded-lg hover:border-(--btn-bg) text-[#777777]">
                                <Youtube className="transition-colors text-[#777777] group-hover:text-(--btn-bg)" />
                            </Link>
                            <Link href="#" className="hover:text-(--btn-bg) transition-colors border border-[#777777] rounded-lg hover:border-(--btn-bg) text-[#777777]">
                                <Tweeter className="transition-colors text-[#777777] group-hover:text-(--btn-bg)" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[rgba(240,240,240,0.2)] mt-8 pt-8 text-center txtSub text-white font-poppins">
                    <p>LFE  2025. All Rights Reserved. Designed by 4Fox</p>
                </div>
            </div>
        </footer>
    )
}
