import React from "react";

export default async function TermsAndCondition() {

  const termData = [
    {
      title: "Terms and Condition",
      description:
        "<b>LFE</b> is committed to protecting your privacy and developing technology that gives you the most powerful and safe online experience. This Statement of Privacy applies to the LFE Web site and governs data collection and usage. By using the LFE  website, you consent to the data practices described in this statement.",
      content: [
        {
          title: "Collection of your Personal Information",
          content: [
            "LFE collects personally identifiable information, such as your e-mail address, name, home or work address or telephone number. LFE also collects anonymous demographic information, which is not unique to you, such as your ZIP code, age, gender, preferences, interests and favourites.",
            "There is also information about your computer hardware and software that is automatically collected by LFE. This information can include: your IP address, browser type, domain names, access times and referring Web site addresses. This information is used by LFE for the operation of the service, to maintain quality of the service, and to provide general statistics regarding use of the LFE Web site.",
            "Please keep in mind that if you directly disclose personally identifiable information or personally sensitive data through LFE public message boards, this information may be collected and used by others. Note: LFE does not read any of your private online communications.",
            "LFE encourages you to review the privacy statements of Web sites you choose to link to from LFE so that you can understand how those Web sites collect, use and share your information. LFE is not responsible for the privacy statements or other content on Web sites outside of the LFE family of Web sites.",
          ],
        },
        {
          title: "Use of your Personal Information",
          content: [
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          ],
        },
        {
          title: "Use of your Personal Information",
          content: [
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          ],
        },
        {
          title: "Use of Cookies",
          content: [
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          ],
        },
        {
          title: "Security of your Personal Information",
          content: [
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          ],
        },
        {
          title: "Changes to this Statement",
          content: [
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          ],
        },
        {
          title: "Contact Information",
          content: [
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          ],
        },
      ],
    },
  ];

  return (
    <>
      <div
        className="relative commonGap min-h-[20dvh] content-center"
        style={{
          backgroundImage: "url('/banner-bg.png')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundColor: "#F7F9FB",
        }}
      ></div>
      <div className="privacyTermData font-open-sans commonGap w-full relative">
        <div className="sub-wrapper">
          {termData.map((section, sectionIndex) => (
            <React.Fragment key={sectionIndex}>
              {/* Main Title */}
              <div className="privacyTermDataTitle commonTitle mb-5 md:mb-10 lg:mb-18">
                <h2>{section.title}</h2>
              </div>

              {/* Description (HTML allowed) */}
              {section.description && (
                <div className="privacyTermDataDesc mb-8 lg:mb-14">
                  <p
                    className="subTxt text-[#606060]"
                    dangerouslySetInnerHTML={{ __html: section.description }}
                  />
                </div>
              )}

              {/* Content Blocks */}
              <div className="privacyTermDataCont">
                {section.content.map((block, blockIndex) => (
                  <div
                    key={blockIndex}
                    className="privacyTermDataContInfo mb-6 lg:mb-10"
                  >
                    {/* Block Title */}
                    <h5 className="text-[length:var(--sub-title)] text-[#606060] font-bold mb-6 lg:mb-7.5">
                      {block.title}
                    </h5>

                    {/* Paragraphs */}
                    {block.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="subTxt text-[#606060] mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
