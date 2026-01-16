import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "../../../icons/CheckCircleIcon";
import CloseIcon from "../../../icons/CloseIcon";
import type { TripStatus } from "../../../types/enums";
import type { Trip } from "../../../types/domain";

interface TripTrackingTreeProps {
  trip: Trip;
}

interface TrackingStep {
  status: TripStatus;
  label: string;
  icon: React.ReactNode;
  timestamp?: string | null;
  isActive: boolean;
  isCompleted: boolean;
  isCancelled: boolean;
}

const TripTrackingTree = ({ trip }: TripTrackingTreeProps) => {
  const getStepStatus = (stepStatus: TripStatus): { isCompleted: boolean; isActive: boolean } => {
    const statusOrder: TripStatus[] = ['pending', 'accepted', 'started', 'completed', 'cancelled'];
    const currentIndex = statusOrder.indexOf(trip.status);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (trip.status === 'cancelled') {
      return {
        isCompleted: stepStatus === 'cancelled',
        isActive: stepStatus === 'cancelled',
      };
    }

    return {
      isCompleted: stepIndex < currentIndex,
      isActive: stepIndex === currentIndex,
    };
  };

  const steps: TrackingStep[] = [
    {
      status: 'pending',
      label: 'Pending',
      icon: <Box className="w-5 h-5 border-2 border-current rounded-full" />,
      timestamp: trip.created_at,
      ...getStepStatus('pending'),
      isCancelled: false,
    },
    {
      status: 'accepted',
      label: 'Accepted',
      icon: <CheckCircleIcon className="w-5 h-5" />,
      timestamp: trip.accepted_at,
      ...getStepStatus('accepted'),
      isCancelled: false,
    },
    {
      status: 'started',
      label: 'Started',
      icon: <Box className="w-5 h-5 border-2 border-current rounded-full flex items-center justify-center"><Box className="w-2 h-2 bg-current rounded-full" /></Box>,
      timestamp: trip.started_at,
      ...getStepStatus('started'),
      isCancelled: false,
    },
    {
      status: 'completed',
      label: 'Completed',
      icon: <CheckCircleIcon className="w-5 h-5" />,
      timestamp: trip.completed_at,
      ...getStepStatus('completed'),
      isCancelled: false,
    },
  ];

  // Add cancelled step if trip is cancelled
  if (trip.status === 'cancelled') {
    steps.push({
      status: 'cancelled',
      label: 'Cancelled',
      icon: <CloseIcon className="w-5 h-5" />,
      timestamp: trip.cancelled_at,
      isActive: true,
      isCompleted: true,
      isCancelled: true,
    });
  }

  const getStepColor = (step: TrackingStep) => {
    if (step.isCancelled) {
      return {
        bg: 'bg-red-50',
        border: 'border-red-500',
        text: 'text-red-700',
        icon: 'text-red-500',
        line: 'bg-red-300',
      };
    }
    if (step.isCompleted) {
      return {
        bg: 'bg-green-50',
        border: 'border-green-500',
        text: 'text-green-700',
        icon: 'text-green-500',
        line: 'bg-green-300',
      };
    }
    if (step.isActive) {
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-500',
        text: 'text-blue-700',
        icon: 'text-blue-500',
        line: 'bg-blue-200',
      };
    }
    return {
      bg: 'bg-gray-50',
      border: 'border-gray-300',
      text: 'text-gray-500',
      icon: 'text-gray-400',
      line: 'bg-gray-200',
    };
  };

  return (
    <Box className="relative">
      {/* Timeline Container */}
      <Box className="relative">
        {steps.map((step, index) => {
          const colors = getStepColor(step);
          const isLast = index === steps.length - 1;
          
          return (
            <Box key={step.status} className="relative">
              {/* Step Content */}
              <Box className="flex items-start gap-4 pb-8">
                {/* Icon Circle */}
                <Box
                  className={`
                    relative z-10 flex items-center justify-center
                    w-14 h-14 rounded-full border-4 transition-all duration-300
                    ${colors.bg} ${colors.border}
                    ${step.isActive ? 'scale-110 shadow-lg ring-4 ring-opacity-30 ' + colors.border.replace('border-', 'ring-') : ''}
                    ${step.isCompleted ? 'shadow-md' : ''}
                  `}
                >
                  <Box className={colors.icon}>
                    {step.isCompleted ? (
                      <CheckCircleIcon className="w-7 h-7" />
                    ) : step.isActive ? (
                      <Box className="animate-pulse">
                        {step.icon}
                      </Box>
                    ) : (
                      <Box className="w-7 h-7 border-2 border-current rounded-full" />
                    )}
                  </Box>
                </Box>

                {/* Step Details */}
                <Box className="flex-1 pt-1">
                  <Box className="flex items-center gap-3 mb-2">
                    <Typography
                      variant="h6"
                      className={`!font-bold ${colors.text} transition-colors`}
                    >
                      {step.label}
                    </Typography>
                    {step.isActive && (
                      <Box className="px-2 py-1 rounded-full bg-blue-100">
                        <Typography variant="caption" className="!text-blue-700 !font-semibold">
                          Current
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  {step.timestamp ? (
                    <Typography variant="body2" className="!text-gray-600 !mb-1">
                      {new Date(step.timestamp).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Typography>
                  ) : (
                    <Typography variant="body2" className="!text-gray-400 italic">
                      Not yet
                    </Typography>
                  )}
                  
                  {step.timestamp && (
                    <Typography variant="caption" className="!text-gray-500">
                      {new Date(step.timestamp).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Connecting Line */}
              {!isLast && (
                <Box
                  className={`
                    absolute left-7 top-14 w-0.5 h-full
                    ${step.isCompleted ? colors.line : 'bg-gray-200'}
                    transition-colors duration-300
                  `}
                />
              )}
            </Box>
          );
        })}
      </Box>

      {/* Cancellation Reason (if cancelled) */}
      {trip.status === 'cancelled' && trip.cancellation_reason && (
        <Box className="mt-6 p-4 rounded-xl bg-red-50 border-2 border-red-200">
          <Typography variant="caption" className="!text-red-700 !block !mb-2 !font-semibold">
            Cancellation Reason
          </Typography>
          <Typography variant="body2" className="!text-gray-900">
            {trip.cancellation_reason}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TripTrackingTree;

