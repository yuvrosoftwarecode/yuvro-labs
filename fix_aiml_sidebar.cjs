const fs = require('fs');

function updateSidebar(filePath, values, applyLink) {
  const code = fs.readFileSync(filePath, 'utf8');
  
  const startStr = '<h3 className="text-xl font-bold tracking-tight mb-6 pb-4 border-b border-[#E8E6E1]">Position Overview</h3>';
  const endStr = '</div>\n        </div>\n      </div>\n    </div>\n  );\n}';
  
  const startIndex = code.indexOf(startStr);
  const endIndex = code.indexOf(endStr);
  
  if (startIndex === -1 || endIndex === -1) {
    console.log("Could not find start or end in", filePath);
    return;
  }
  
  const newSidebarContent = `
            <div className="flex flex-col">
              <div className="flex gap-4 pb-4 border-b border-[#E8E6E1] mb-4">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8E6E1] bg-[#FAFAF8] text-[#4A4A4A]">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#6B6B6B]">Role</p>
                  <p className="mt-0.5 text-[14.5px] font-semibold text-[#0A0A0A] leading-tight">${values.role}</p>
                </div>
              </div>

              <div className="flex gap-4 pb-4 border-b border-[#E8E6E1] mb-4">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8E6E1] bg-[#FAFAF8] text-[#4A4A4A]">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#6B6B6B]">Location / Mode</p>
                  <p className="mt-0.5 text-[14.5px] font-semibold text-[#0A0A0A] leading-tight">${values.location}</p>
                </div>
              </div>

              <div className="flex gap-4 pb-4 border-b border-[#E8E6E1] mb-4">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8E6E1] bg-[#FAFAF8] text-[#4A4A4A]">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#6B6B6B]">${values.typeLabel}</p>
                  <p className="mt-0.5 text-[14.5px] font-semibold text-[#0A0A0A] leading-tight">${values.type}</p>
                </div>
              </div>

              <div className="flex gap-4 pb-4 border-b border-[#E8E6E1]">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8E6E1] bg-[#FAFAF8] text-[#4A4A4A]">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#6B6B6B]">Duration</p>
                  <p className="mt-0.5 text-[14.5px] font-semibold text-[#0A0A0A] leading-tight">${values.duration}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E8E6E1]">
              <Link
                to="${applyLink}"
                className="flex w-full items-center justify-center rounded-lg bg-[#0A0A0A] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-95"
              >
                Apply Now
              </Link>
            </div>
          </div>
        `;

  const updatedCode = code.substring(0, startIndex + startStr.length) + '\n' + newSidebarContent + code.substring(endIndex);
  fs.writeFileSync(filePath, updatedCode);
  console.log("Updated", filePath);
}

updateSidebar('src/routes/careers.ai-ml-engineer-intern.tsx', {
  role: 'AI/ML Engineer Intern',
  location: 'Remote',
  typeLabel: 'Type',
  type: 'Full-time Internship',
  duration: '3 Months'
}, '/careers/apply-aiml');
