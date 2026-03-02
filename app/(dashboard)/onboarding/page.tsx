import PanVerification from "@/components/PanVerification";
import UserLocation from "@/components/UserLocation";

export default function OnboardingPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 transition-all duration-500 text-start">
            <UserLocation />
            <PanVerification />
        </div>
    );
}
