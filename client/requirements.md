## Packages
react-webcam | For capturing eye images directly in the browser
framer-motion | For smooth page transitions and UI animations
lucide-react | For beautiful iconography (Eye, Camera, Upload, etc.)
clsx | For conditional class merging
tailwind-merge | For merging tailwind classes

## Notes
- Using standard HTML5 file input with `capture="environment"` for mobile camera support as a fallback/alternative to react-webcam.
- Images are handled as base64 strings for API simplicity.
- Authentication is handled via Replit Auth (use-auth hook).
